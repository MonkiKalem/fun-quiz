import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [hasOngoingQuiz, setHasOngoingQuiz] = useState(false);
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
    };

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <h2>Welcome to the Quiz, {username}</h2>
            <button className="btn btn-danger" onClick={handleLogout}>
                Logout
            </button>
            <p>Test your knowledge by taking the quiz!</p>
            {hasOngoingQuiz && (
                <div>
                    <button className="btn btn-warning" onClick={resumeQuiz}>
                        Resume Last Quiz
                    </button>
                    <button className="btn btn-danger" onClick={startNewQuiz}>
                        Start New Quiz
                    </button>
                </div>
            )}
            {!hasOngoingQuiz && (
                <button className="btn btn-primary" onClick={startNewQuiz}>
                    Start Quiz
                </button>
            )}

            <div className="history-section">
                <div className="history-header">
                    <h3>Quiz History</h3>
                    <button className="btn btn-secondary" onClick={clearHistory}>
                        Clear History
                    </button>
                </div>
                <div className="history-grid">
                    {history.length > 0 ? (
                        history.map((record, index) => (
                            <div key={index} className="card">
                                <div className="card-body">
                                    <p>Quiz {index + 1}: Score {record.score}/{record.total}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No quiz history available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
