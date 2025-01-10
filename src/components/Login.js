import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);  // For showing modal
    const [modalMessage, setModalMessage] = useState('');  // Modal message
    const [modalImage, setModalImage] = useState('');  // Image to show in modal
    const navigate = useNavigate();

    const handleLogin = () => {
        const userData = JSON.parse(localStorage.getItem('userData')) || [];

        // Cek apakah username dan password sesuai
        const validUser = userData.find(user => user.username === username && user.password === password);

        if (validUser) {
            // Menyimpan status login ke sessionStorage
            sessionStorage.setItem('loggedInUser', JSON.stringify(validUser));
            setModalMessage('Login successful!');
            setModalImage('images/right.svg'); 
            setShowModal(true); // Show modal for success
        } else {
            setModalMessage('Invalid username or password. Please try again.');
            setModalImage('images/wrong.svg'); 
            setShowModal(true); // Show modal for error
        }
    };

    const closeModal = () => {
        setShowModal(false);
        if (modalMessage === 'Login successful!') {
            navigate('/dashboard'); // Redirect ke halaman dashboard setelah sukses
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="left-side">
                    <div className="app-name">
                        <h1>Fun Quiz</h1>
                    </div>
                    <img src="images/question.svg" alt="Fun Quiz" className="quiz-image" />
                </div>
                <div className="right-side">
                    <h2 className="login-title">Login</h2>
                    <form className="login-form">
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="button" className="login-btn" onClick={handleLogin}>
                            Login
                        </button>
                    </form>
                    <div className="register-link">
                        <p>Don't have an account? <a href="/">Register here</a></p>
                    </div>
                </div>
            </div>

            {/* Modal for login success or error */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <img src={modalImage} className="status-icon" alt="status-icon"/> 
                        <p>{modalMessage}</p>
                        <button className="btn btn-primary" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
