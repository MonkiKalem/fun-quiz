import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import he from 'he';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(60); // Timer in seconds
    const [showModal, setShowModal] = useState(false); // For custom alert modal
    const [modalMessage, setModalMessage] = useState(""); // Custom message for modal
    const [showExitModal, setShowExitModal] = useState(false); // For exit modal confirmation
    const navigate = useNavigate();
    const username = JSON.parse(sessionStorage.getItem('loggedInUser'))?.username; // Retrieve the username from sessionStorage

    useEffect(() => {
        if (!username) {
            // Redirect to login if no username found in sessionStorage
            navigate('/login');
            return;
        }

        // Retrieve the current quiz from localStorage based on username
        const savedQuiz = JSON.parse(localStorage.getItem(`${username}_currentQuiz`));
        if (savedQuiz && savedQuiz.questions.length > 0 && savedQuiz.timer > 0) {
            // Continue the quiz if there's a saved quiz and the timer is not expired
            setQuestions(savedQuiz.questions);
            setCurrentQuestionIndex(savedQuiz.currentQuestionIndex);
            setScore(savedQuiz.score);
            setTimer(savedQuiz.timer);
        } else {
            // Start a new quiz if there's no ongoing quiz
            axios.get('https://opentdb.com/api.php?amount=10')
                .then(response => {
                    setQuestions(response.data.results);
                    localStorage.setItem(`${username}_currentQuiz`, JSON.stringify({
                        questions: response.data.results,
                        currentQuestionIndex: 0,
                        score: 0,
                        timer: 60,
                    }));
                })
                .catch(error => console.error('Error fetching questions:', error));
        }
    }, [navigate, username]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    // Timer expired, clear the quiz from localStorage and handle quiz end
                    clearInterval(interval);
                    handleQuizEnd(true); // true indicates timer expiry
                    return 0;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (questions.length > 0 && timer > 0) {
            // Update the quiz state in localStorage while the quiz is ongoing
            localStorage.setItem(`${username}_currentQuiz`, JSON.stringify({
                questions,
                currentQuestionIndex,
                score,
                timer,
            }));
        }
    }, [questions, currentQuestionIndex, score, timer, username]);

    const handleAnswer = (isCorrect) => {
        const savedQuiz = JSON.parse(localStorage.getItem(`${username}_currentQuiz`));

        if (isCorrect) {
            savedQuiz.score += 1;  // Update score from saved quiz
        }

        if (savedQuiz.currentQuestionIndex < questions.length - 1) {
            savedQuiz.currentQuestionIndex += 1;  // Move to next question
        } else {
            // Handle quiz completion when all questions are answered
            handleQuizEnd(false, savedQuiz); // false indicates user finished all questions
            return;
        }

        // Save updated quiz state to localStorage
        localStorage.setItem(`${username}_currentQuiz`, JSON.stringify(savedQuiz));
        setCurrentQuestionIndex(savedQuiz.currentQuestionIndex);
        setScore(savedQuiz.score);  // Update score in state as well
    };

    const handleQuizEnd = (isTimeUp) => {
        const savedQuiz = JSON.parse(localStorage.getItem(`${username}_currentQuiz`));
    
        if (!savedQuiz) {
            console.error('No quiz data found in localStorage.');
            navigate('/dashboard');
            return;
        }

        // Save the score to quiz history
        const history = JSON.parse(localStorage.getItem(`${username}_quizHistory`)) || [];
        history.push({ score: savedQuiz.score, total: savedQuiz.questions.length });
        localStorage.setItem(`${username}_quizHistory`, JSON.stringify(history));

        setTimeout(() => {
            if (isTimeUp) {   
                setModalMessage(`Time's up! You scored ${savedQuiz.score}/${savedQuiz.questions.length}.`);
            } else {
                setModalMessage(`Quiz completed! You scored ${savedQuiz.score}/${savedQuiz.questions.length}.`);
            }
            setShowModal(true);
        }, 0);
    };

    const closeModal = () => {
        setShowModal(false);
        localStorage.removeItem(`${username}_currentQuiz`);
        navigate('/dashboard');
    };

    // Handle "Back" button click
    const handleBackButtonClick = () => {
        setShowExitModal(true); // Show exit confirmation modal
    };

    const closeExitModal = (continueQuiz) => {
        setShowExitModal(false);
        if (!continueQuiz) {
            navigate('/dashboard');
        }
    };

    if (!questions.length) {
        return (
            <div className="quiz-loading">
                <div className="loading-spinner"></div>
                <p>Loading Questions...</p>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();

    return (
        <div className="quiz-container">
            {/* Back Button */}
            <button className="back-button" onClick={handleBackButtonClick}>
                <img src="images/back.svg" alt="back-icon"/>
            </button>

            <div className="quiz-card">
                <h2 className="quiz-title">Quiz</h2>
                <div className="quiz-progress">
                    <p>Time Remaining: <span className="timer">{timer} seconds</span></p>
                    <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
                <div className="quiz-question-section">
                    <p className="quiz-question">{he.decode(currentQuestion.question)}</p>
                </div>
                <div className="quiz-answers">
                    {allAnswers.map((answer, index) => (
                        <button
                            key={index}
                            className="quiz-answer-btn"
                            onClick={() => handleAnswer(answer === currentQuestion.correct_answer)}
                        >
                            {he.decode(answer)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exit Confirmation Modal */}
            {showExitModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>If you leave now, you can resume later.</p>
                        <button className="btn btn-primary" onClick={() => closeExitModal(true)}>Continue Quiz</button>
                        <button className="btn btn-primary" onClick={() => closeExitModal(false)}>Exit Quiz</button>
                    </div>
                </div>
            )}

            {/* Result Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>{modalMessage}</p>
                        <button className="btn btn-primary" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
