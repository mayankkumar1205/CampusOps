import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../api/config';

const ComplaintDetail = () => {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComplaint = async () => {
            setLoading(true);
            setError('');

            try {
                const res = await axios.get(`${API_BASE_URL}/complaints/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setComplaint(res.data);
            } catch (err) {
                setError('Failed to fetch complaint details.');
            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id]);

    if (loading) {
        return <div className="container py-4">Loading...</div>;
    }

    if (error) {
        return <div className="container py-4 alert alert-danger">{error}</div>;
    }

    if (!complaint) {
        return <div className="container py-4">Complaint not found.</div>;
    }

    const statusHistory = Array.isArray(complaint.statusHistory)
        ? complaint.statusHistory
        : [];

    return (
        <div className="container py-4">
            <h2>{complaint.title}</h2>

            <p><strong>Status:</strong> {complaint.status}</p>
            <p><strong>Category:</strong> {complaint.category}</p>
            <p>
                <strong>Due Date:</strong>{' '}
                {complaint.dueDate
                    ? new Date(complaint.dueDate).toLocaleDateString()
                    : `${complaint.dueInDays} day(s)`}
            </p>
            <p><strong>Description:</strong> {complaint.description}</p>

            {complaint.imageUrl && (
                <div className="mb-3">
                    <img
                        src={complaint.imageUrl}
                        alt="Complaint"
                        style={{ maxWidth: '300px' }}
                    />
                </div>
            )}

            <p>
                <strong>Submitted:</strong>{' '}
                {new Date(complaint.date).toLocaleString()}
            </p>

            <section className="mt-4">
                <h3>Status History</h3>

                {statusHistory.length > 0 ? (
                    <ol className="list-group list-group-numbered">
                        {statusHistory.map((entry, index) => (
                            <li
                                className="list-group-item"
                                key={entry._id || `${entry.status}-${entry.changedAt}-${index}`}
                            >
                                <strong>
                                    {entry.status?.replace('-', ' ')}
                                </strong>

                                {entry.note && <p className="mb-1">{entry.note}</p>}

                                {entry.changedAt && (
                                    <small className="text-muted">
                                        {new Date(entry.changedAt).toLocaleString()}
                                    </small>
                                )}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-muted">No status history is available yet.</p>
                )}
            </section>
        </div>
    );
};

export default ComplaintDetail;