import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        const userData = JSON.parse(localStorage.getItem('userData')) || [];

        // Cek apakah username dan password sesuai
        const validUser = userData.find(user => user.username === username && user.password === password);

        if (validUser) {
            // Menyimpan status login ke sessionStorage
            sessionStorage.setItem('loggedInUser', JSON.stringify(validUser));
            alert('Login successful!');
            navigate('/dashboard'); // Redirect ke halaman dashboard
        } else {
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
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
                    <p>Don't have an account? <a href="/register">Register here</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
