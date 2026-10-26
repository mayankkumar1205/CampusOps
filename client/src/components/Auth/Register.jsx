import React, { useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import API_BASE_URL from '../../api/config';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();
    const { role } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (
            !name.trim() ||
            !email.trim() ||
            !password.trim() ||
            !department.trim()
        ) {
            setError('All fields are required.');
            return;
        }

        try {
            await axios.post(`${API_BASE_URL}/auth/register`, {
                email: email.trim(),
                password,
                name: name.trim(),
                role: 'student',
                department: department.trim()
            });

            history.push('/login/student');
        } catch (err) {
            console.error('Registration error:', err);
            setError(
                err.response?.data?.message ||
                    'Registration failed. Please try again.'
            );
        }
    };

    if (role !== 'student') {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div
                    className="card shadow p-4 text-center"
                    style={{ minWidth: 350, maxWidth: 450 }}
                >
                    <h2 className="mb-3">Staff registration unavailable</h2>
                    <p>
                        Staff accounts must be created by a campus
                        administrator.
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => history.push('/')}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div
                className="card shadow p-4"
                style={{ minWidth: 350, maxWidth: 400 }}
            >
                <h2
                    className="mb-4 text-center"
                    style={{ color: 'var(--primary-blue)' }}
                >
                    Student Registration
                </h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            placeholder="Enter your email address"
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
                            autoComplete="new-password"
                            placeholder="Create a password"
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Department/Branch</label>
                        <select
                            className="form-select"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                        >
                            <option value="">Select Department/Branch</option>
                            <option value="IT">IT</option>
                            <option value="CSE">CSE</option>
                            <option value="CSD">CSD</option>
                            <option value="MECH">MECH</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="EIE">EIE</option>
                            <option value="AUTOMOB">AUTOMOB</option>
                            <option value="MTS">MTS</option>
                            <option value="AIDS">AIDS</option>
                            <option value="AIML">AIML</option>
                            <option value="CHEM">CHEM</option>
                            <option value="FT">FT</option>
                            <option value="1ST YEAR">1ST YEAR</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-2"
                    >
                        Register
                    </button>

                    <button
                        type="button"
                        className="btn btn-link w-100"
                        onClick={() => history.push('/login/student')}
                    >
                        Already have an account? Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;