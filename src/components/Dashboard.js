import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [hasOngoingQuiz, setHasOngoingQuiz] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showStartNewQuizModal, setShowStartNewQuizModal] = useState(false);
    const [showClearHistoryModal, setShowClearHistoryModal] = useState(false); // Modal state for clearing history
    const navigate = useNavigate();
    const username = JSON.parse(sessionStorage.getItem('loggedInUser'))?.username;

    useEffect(() => {
        if (!username) {
            navigate('/login');
            return;
        }

        const quizHistory = JSON.parse(localStorage.getItem(`${username}_quizHistory`)) || [];
        setHistory(quizHistory);

        const currentQuiz = localStorage.getItem(`${username}_currentQuiz`);
        setHasOngoingQuiz(!!currentQuiz);
    }, [navigate, username]);

    const resumeQuiz = () => {
        navigate('/quiz');
    };

    const startNewQuiz = () => {
        localStorage.removeItem(`${username}_currentQuiz`);
        navigate('/quiz');
    };

    const clearHistory = () => {
        localStorage.removeItem(`${username}_quizHistory`);
        setHistory([]); // Clear history from state
        setShowClearHistoryModal(false); // Close modal after clearing history
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        setShowLogoutModal(false);
        navigate('/login');
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleStartNewQuiz = () => {
        if (hasOngoingQuiz) {
            setShowStartNewQuizModal(true);
        } else {
            startNewQuiz();
        }
    };

    const confirmStartNewQuiz = () => {
        startNewQuiz();
        setShowStartNewQuizModal(false);
    };

    const cancelStartNewQuiz = () => {
        setShowStartNewQuizModal(false);
    };

    const handleClearHistory = () => {
        setShowClearHistoryModal(true); // Show confirmation modal
    };

    const cancelClearHistory = () => {
        setShowClearHistoryModal(false); // Close modal without clearing history
    };

    return (
        <div className="dashboard-container">
            <div className="welcome-section">
                <h2>Welcome, {username}!</h2>
                <p>Ready to test your knowledge? Start a quiz or resume your last one.</p>
            </div>
            
            <div className="actions-section">
                <button className="btn btn-danger" onClick={handleLogout}> 
                    <img src="images/logout.svg" className="logout-icon" alt="logout-icon"/> 
                    Logout
                </button>
                {hasOngoingQuiz ? (
                    <>
                        <button className="btn btn-primary" onClick={resumeQuiz}>Resume Last Quiz</button>
                        <button className="btn btn-primary" onClick={handleStartNewQuiz}>Start New Quiz</button>
                    </>
                ) : (
                    <button className="btn btn-primary" onClick={startNewQuiz}>Start Quiz</button>
                )}
            </div>
            
            <div className="history-section">
                <div className="history-header">
                    <h3>Quiz History</h3>
                    <button className="btn btn-secondary" onClick={handleClearHistory}>Clear History</button> {/* Trigger modal */}
                </div>
                <div className="history-grid">
                    {history.length > 0 ? (
                        history.map((record, index) => (
                            <div key={index} className="card">
                                <div className="card-body">
                                    <h4>Quiz {index + 1}</h4>
                                    <p>Score: {record.score}/{record.total}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No quiz history available.</p>
                    )}
                </div>
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Are you sure you want to logout?</p>
                        <button className="btn btn-primary" onClick={cancelLogout}>No</button>
                        <button className="btn btn-danger" onClick={confirmLogout}>Yes</button>
                    </div>
                </div>
            )}

            {/* Start New Quiz Modal */}
            {showStartNewQuizModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>You have an ongoing quiz. Are you sure you want to start a new quiz?</p>
                        <button className="btn btn-primary" onClick={cancelStartNewQuiz}>No</button>
                        <button className="btn btn-primary" onClick={confirmStartNewQuiz}>Yes</button>
                    </div>
                </div>
            )}

            {/* Clear History Confirmation Modal */}
            {showClearHistoryModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Are you sure you want to clear your quiz history?</p>
                        <button className="btn btn-primary" onClick={cancelClearHistory}>No</button>
                        <button className="btn btn-danger" onClick={clearHistory}>Yes</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
