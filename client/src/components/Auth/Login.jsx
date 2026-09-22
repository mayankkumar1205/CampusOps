import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = ({ setIsLoggedIn, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('https://campus-complaint-system.onrender.com/api/auth/login', { email, password, role });
            localStorage.setItem('token', response.data.token);
            setIsLoggedIn(true);
            if (onLoginSuccess) {
                onLoginSuccess(response, history);
            }
            history.push('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow p-4" style={{ minWidth: 350, maxWidth: 400 }}>
                <h2 className="mb-4 text-center" style={{ color: 'var(--primary-blue)' }}>Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Role</label>
                        <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
                    <button type="button" className="btn btn-link w-100" onClick={() => history.push('/register/student')}>Don't have an account? Register</button>
                </form>
            </div>
        </div>
    );
};

export default Login;