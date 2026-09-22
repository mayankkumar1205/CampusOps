import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ComplaintDetail = () => {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComplaint = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`https://campus-complaint-system.onrender.com/api/complaints/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setComplaint(res.data);
            } catch (err) {
                setError('Failed to fetch complaint details');
            }
            setLoading(false);
        };
        fetchComplaint();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!complaint) return <div>Complaint not found.</div>;

    return (
        <div>
            <h2>{complaint.title}</h2>
            <p><strong>Status:</strong> {complaint.status}</p>
            <p><strong>Category:</strong> {complaint.category}</p>
            <p><strong>Due In:</strong> {complaint.dueInDays} day(s)</p>
            <p><strong>Description:</strong> {complaint.description}</p>
            {complaint.imageUrl && (
                <div>
                    <img src={complaint.imageUrl} alt="Complaint" style={{ maxWidth: '300px' }} />
                </div>
            )}
            <p><strong>Date:</strong> {new Date(complaint.date).toLocaleString()}</p>
        </div>
    );
};

export default ComplaintDetail;