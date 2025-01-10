import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import he from 'he';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(60); // Timer in seconds
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
        // Retrieve the current quiz from localStorage to make sure it's not null
        const savedQuiz = JSON.parse(localStorage.getItem(`${username}_currentQuiz`));
    
        // Check if savedQuiz exists, otherwise just handle the case where it's null
        if (!savedQuiz) {
            console.error('No quiz data found in localStorage.');
            navigate('/dashboard');
            return;
        }
    
        // Save the score to quiz history
        const history = JSON.parse(localStorage.getItem(`${username}_quizHistory`)) || [];
        history.push({ score: savedQuiz.score, total: savedQuiz.questions.length });
        localStorage.setItem(`${username}_quizHistory`, JSON.stringify(history));
    
        // Clear the current quiz from localStorage once the quiz ends
        localStorage.removeItem(`${username}_currentQuiz`);
    
        // Alert user and navigate to the dashboard
        setTimeout(() => {
            if (isTimeUp) {
                alert('Time is up! Redirecting to dashboard.');
            } else {
                alert('Quiz completed! Redirecting to dashboard.');
            }
    
            navigate('/dashboard');
        }, 0);
    };

    if (!questions.length) {
        return <div className="quiz-loading">Loading...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();

    return (
        <div className="quiz-container">
            <div className="quiz-card">
                <h2 className="quiz-title">Quiz</h2>
                <p>Time Remaining: {timer} seconds</p>
                <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
                {/* Decode the question using 'he' */}
                <p className="quiz-question">{he.decode(currentQuestion.question)}</p>
                <div className="quiz-answers">
                    {allAnswers.map((answer, index) => (
                        <button
                            key={index}
                            className="quiz-answer-btn"
                            onClick={() => handleAnswer(answer === currentQuestion.correct_answer)}
                        >
                            {he.decode(answer)} {/* Decode the answer */}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
