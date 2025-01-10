import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        // Validasi username
        if (username.length < 4) {
            setError('Username must be at least 4 characters.');
            return false;
        }

        // Validasi password
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }

        // Password harus mengandung setidaknya satu huruf dan satu angka
        if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
            setError('Password must contain at least one letter and one number.');
            return false;
        }

        // Konfirmasi password
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }

        setError('');
        return true;
    };

    const handleRegister = () => {
        if (!validateForm()) {
            return;
        }

        const userData = JSON.parse(localStorage.getItem('userData')) || [];

        // Cek apakah username sudah ada
        const existingUser = userData.find(user => user.username === username);
        if (existingUser) {
            alert('Username already exists! Please choose a different username.');
            return;
        }

        // Menambah user baru ke array userData
        userData.push({ username, password });

        // Menyimpan array userData yang sudah diperbarui ke localStorage
        localStorage.setItem('userData', JSON.stringify(userData));

        alert('Registration successful! Redirecting to login page.');
        navigate('/login');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Register</h2>
                <form className="register-form">
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
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="button" className="register-btn" onClick={handleRegister}>
                        Register
                    </button>
                </form>
                <div className="login-link">
                    <p>Already have an account? <a href="/login">Login here</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
