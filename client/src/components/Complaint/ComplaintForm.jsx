import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [dueInDays, setDueInDays] = useState(1);
    const [image, setImage] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You are not logged in. Please log in again.');
                return;
            }
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('dueInDays', dueInDays);
            if (image) formData.append('image', image);
            await axios.post('https://campus-complaint-system.onrender.com/api/complaints', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('Complaint submitted successfully!');
            setTitle('');
            setDescription('');
            setCategory('');
            setDueInDays(1);
            setImage(null);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to submit complaint. Please try again.');
            }
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow p-4">
                        <h2 className="mb-4 text-center" style={{ color: 'var(--primary-blue)' }}>Submit Complaint</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Hostel">Hostel</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Mess">Mess</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Classroom">Classroom</option>
                                    <option value="Lab">Lab</option>
                                    <option value="Canteen">Canteen</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Due In</label>
                                <select className="form-select" value={dueInDays} onChange={e => setDueInDays(Number(e.target.value))}>
                                    <option value={1}>Within 1 day</option>
                                    <option value={2}>Within 2 days</option>
                                    <option value={3}>More days</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image (optional)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={e => setImage(e.target.files[0])}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintForm;