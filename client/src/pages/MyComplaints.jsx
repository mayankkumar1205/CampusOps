import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const statusColors = {
  'pending': 'secondary',
  'in-progress': 'warning',
  'resolved': 'success'
};

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackState, setFeedbackState] = useState({}); // { [complaintId]: { rating, comment, submitted } }
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const history = useHistory();

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const complaintsRes = await axios.get('https://campus-complaint-system.onrender.com/api/complaints/my', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setComplaints(complaintsRes.data);
        } catch (err) {
            setError('Failed to fetch complaints');
        }
        setLoading(false);
    };

    const fetchFeedbacks = async () => {
        try {
            const feedbacksRes = await axios.get('https://campus-complaint-system.onrender.com/api/feedback', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFeedbacks(feedbacksRes.data);
        } catch (err) {
            setError('Failed to fetch feedbacks');
        }
    };

    const fetchProfile = async () => {
        try {
            const profileRes = await axios.get('https://campus-complaint-system.onrender.com/api/auth/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUserInfo(profileRes.data);
        } catch (err) {
            setError('Failed to fetch profile');
        }
    };

    useEffect(() => {
        fetchComplaints();
        fetchFeedbacks();
        fetchProfile();
    }, []);

    const calculateStats = (complaintsData) => {
        const stats = {
            total: complaintsData.length,
            pending: complaintsData.filter(c => c.status === 'pending').length,
            inProgress: complaintsData.filter(c => c.status === 'in-progress').length,
            resolved: complaintsData.filter(c => c.status === 'resolved').length
        };
        setStats(stats);
    };

    const handleFeedbackChange = (complaintId, field, value) => {
        setFeedbackState(prev => ({
            ...prev,
            [complaintId]: {
                ...prev[complaintId],
                [field]: value
            }
        }));
    };

    const submitFeedback = async (complaintId, rating, comment) => {
        try {
            await axios.post('https://campus-complaint-system.onrender.com/api/feedback', { complaintId, rating, comment }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchFeedbacks();
        } catch (err) {
            setError('Failed to submit feedback');
        }
    };

    // Helper: check if feedback already exists for this complaint
    const hasFeedback = (complaintId) => feedbacks.some(f => f.complaintId && f.complaintId._id === complaintId);

    const filteredAndSortedComplaints = complaints
        .filter(c => {
            const matchesFilter = filter === 'all' || c.status === filter;
            const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                c.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.date) - new Date(a.date);
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your complaints...</p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <h2 className="mb-2" style={{ color: 'var(--primary-blue)' }}>
                        <i className="fas fa-clipboard-list me-2"></i>My Complaints
                    </h2>
                    {userInfo && (
                        <p className="text-muted mb-0">
                            Track and manage your submitted complaints, <strong>{userInfo.name}</strong>
                        </p>
                    )}
                </div>
                <div className="col-md-4 text-md-end">
                    <div className="d-flex gap-2 justify-content-md-end">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => window.location.reload()}>
                            <i className="fas fa-sync-alt me-1"></i>Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card bg-primary text-white h-100">
                        <div className="card-body text-center">
                            <i className="fas fa-clipboard-list mb-2" style={{ fontSize: '2rem' }}></i>
                            <h3 className="mb-1">{stats.total}</h3>
                            <p className="mb-0">Total Submitted</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-secondary text-white h-100">
                        <div className="card-body text-center">
                            <i className="fas fa-clock mb-2" style={{ fontSize: '2rem' }}></i>
                            <h3 className="mb-1">{stats.pending}</h3>
                            <p className="mb-0">Pending</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-warning text-white h-100">
                        <div className="card-body text-center">
                            <i className="fas fa-tools mb-2" style={{ fontSize: '2rem' }}></i>
                            <h3 className="mb-1">{stats.inProgress}</h3>
                            <p className="mb-0">In Progress</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card bg-success text-white h-100">
                        <div className="card-body text-center">
                            <i className="fas fa-check-circle mb-2" style={{ fontSize: '2rem' }}></i>
                            <h3 className="mb-1">{stats.resolved}</h3>
                            <p className="mb-0">Resolved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <label className="form-label">Filter by Status</label>
                    <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">All Complaints</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Sort By</label>
                    <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                        <option value="date">Date (Newest)</option>
                        <option value="title">Title</option>
                    </select>
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Search</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search complaints..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Progress Bar */}
            {stats.total > 0 && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h6 className="card-title mb-3">Complaint Status Overview</h6>
                        <div className="progress mb-2" style={{ height: '25px' }}>
                            <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                            >
                                {stats.resolved} Resolved
                            </div>
                            <div 
                                className="progress-bar bg-warning" 
                                style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
                            >
                                {stats.inProgress} In Progress
                            </div>
                            <div 
                                className="progress-bar bg-secondary" 
                                style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                            >
                                {stats.pending} Pending
                            </div>
                        </div>
                        <small className="text-muted">
                            {Math.round((stats.resolved / stats.total) * 100)}% of your complaints have been resolved
                        </small>
                    </div>
                </div>
            )}

            {/* Complaints List */}
            <div className="row">
                {filteredAndSortedComplaints.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <i className="fas fa-inbox text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                        <h5 className="text-muted">No complaints found</h5>
                        <p className="text-muted">
                            {complaints.length === 0 
                                ? "You haven't submitted any complaints yet." 
                                : "No complaints match your current filters."}
                        </p>
                {complaints.length === 0 && (
                            <button 
                                className="btn btn-primary" 
                                onClick={() => history.push('/complaints/new')}
                            >
                                <i className="fas fa-plus me-1"></i>Submit Your First Complaint
                            </button>
                        )}
                    </div>
                ) : (
                    filteredAndSortedComplaints.map(c => (
                    <div className="col-md-6 col-lg-4 mb-4" key={c._id}>
                        <div className="card shadow-sm h-100">
                                <div className="card-header bg-transparent">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h6 className="card-title mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                                            {c.title}
                                        </h6>
                                        <span className={`badge bg-${statusColors[c.status]}`}>
                                            {c.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>
                            <div className="card-body">
                                    <div className="mb-2">
                                        <span className="badge bg-info">{c.category}</span>
                                    </div>
                                    <p className="card-text small text-muted mb-2">
                                        <i className="fas fa-calendar me-1"></i>
                                        {new Date(c.date).toLocaleDateString()}
                                    </p>
                                    <p className="card-text small mb-2">
                                        <strong>Description:</strong> {c.description.length > 100 ? 
                                            c.description.substring(0, 100) + '...' : c.description}
                                    </p>
                                    {c.imageUrl && (
                                        <img src={c.imageUrl} alt="complaint" className="img-fluid rounded mb-2" style={{ maxHeight: '100px' }} />
                                    )}
                                    {c.resolutionNotes && (
                                        <div className="alert alert-info py-2 mb-2 small">
                                            <i className="fas fa-info-circle me-1"></i>
                                            <strong>Resolution Notes:</strong> {c.resolutionNotes}
                                        </div>
                                    )}
                                    {c.staffUpdates && c.staffUpdates.length > 0 && (
                                        <div className="mb-2">
                                            <small className="text-muted">
                                                <i className="fas fa-history me-1"></i>
                                                {c.staffUpdates.length} staff update{c.staffUpdates.length > 1 ? 's' : ''}
                                            </small>
                                        </div>
                                    )}
                                    
                                    {/* Feedback form for resolved complaints without feedback */}
                                    {c.status === 'resolved' && !hasFeedback(c._id) && !feedbackState[c._id]?.submitted && (
                                        <div className="mt-3 p-3 bg-light rounded">
                                            <h6 className="mb-3">
                                                <i className="fas fa-star me-1"></i>Give Feedback
                                            </h6>
                                            <div className="mb-2">
                                                <label className="form-label small">Rating</label>
                                                <select 
                                                    className="form-select form-select-sm" 
                                                    value={feedbackState[c._id]?.rating || ''} 
                                                    onChange={e => handleFeedbackChange(c._id, 'rating', e.target.value)} 
                                                    required
                                                >
                                                <option value="">Select Rating</option>
                                                <option value="1">1 - Poor</option>
                                                    <option value="2">2 - Fair</option>
                                                    <option value="3">3 - Good</option>
                                                    <option value="4">4 - Very Good</option>
                                                <option value="5">5 - Excellent</option>
                                            </select>
                                        </div>
                                        <div className="mb-2">
                                                <label className="form-label small">Comment (optional)</label>
                                                <textarea 
                                                    className="form-control form-control-sm" 
                                                    value={feedbackState[c._id]?.comment || ''} 
                                                    onChange={e => handleFeedbackChange(c._id, 'comment', e.target.value)}
                                                    placeholder="Share your experience..."
                                                    rows="2"
                                                />
                                            </div>
                                            <button 
                                                className="btn btn-success btn-sm w-100" 
                                                onClick={() => submitFeedback(c._id, feedbackState[c._id]?.rating, feedbackState[c._id]?.comment)}
                                            >
                                                <i className="fas fa-paper-plane me-1"></i>Submit Feedback
                                            </button>
                                        </div>
                                    )}
                                    {feedbackState[c._id]?.submitted && (
                                        <div className="alert alert-success py-2 mb-2 small">
                                            <i className="fas fa-check-circle me-1"></i>Thank you for your feedback!
                                    </div>
                                )}
                                    {hasFeedback(c._id) && (
                                        <div className="alert alert-info py-2 mb-2 small">
                                            <i className="fas fa-star me-1"></i>Feedback submitted
                                        </div>
                                    )}
                                </div>
                                <div className="card-footer bg-transparent">
                                    <small className="text-muted">
                                        <i className="fas fa-clock me-1"></i>
                                        Submitted {new Date(c.date).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyComplaints;