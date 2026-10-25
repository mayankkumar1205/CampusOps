import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const statusColors = {
    pending: 'secondary',
    'in-progress': 'warning',
    resolved: 'success'
};

const formatDueDate = (complaint) => {
    if (complaint.dueDate) {
        return new Date(complaint.dueDate).toLocaleDateString();
    }

    return `${complaint.dueInDays} day(s)`;
};

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState({
        pending: [],
        inProgress: [],
        resolved: []
    });
    const [staffList, setStaffList] = useState([]);
    const [search, setSearch] = useState('');
    const [notesEdit, setNotesEdit] = useState({});
    const [statusEdit, setStatusEdit] = useState({});
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchComplaints();
        fetchStaff();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${API_BASE_URL}/complaints`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setComplaints(res.data);
        } catch (err) {
            setError('Failed to fetch complaints');
        }

        setLoading(false);
    };

    const fetchStaff = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/auth/staff`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Staff data received:', res.data);
            setStaffList(res.data);
        } catch (err) {
            console.error('Error fetching staff:', err);
            setStaffList([]);
        }
    };

    const handleAssign = async (complaintId, staffId) => {
        try {
            if (!staffId) {
                alert('Please select a staff member to assign.');
                return;
            }

            await axios.put(
                `${API_BASE_URL}/complaints/${complaintId}/assign`,
                { staffId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            console.log(`Complaint ${complaintId} assigned to staff ${staffId}`);
            fetchComplaints();
        } catch (err) {
            console.error('Error assigning complaint:', err);
            alert(
                err.response?.data?.message ||
                    'Failed to assign complaint. Please try again.'
            );
        }
    };

    const handleStatusChange = (complaintId, status) => {
        setStatusEdit((prev) => ({ ...prev, [complaintId]: status }));
    };

    const handleNotesChange = (complaintId, notes) => {
        setNotesEdit((prev) => ({ ...prev, [complaintId]: notes }));
    };

    const handleStatusUpdate = async (complaintId) => {
        await axios.put(
            `${API_BASE_URL}/complaints/${complaintId}/status`,
            {
                status: statusEdit[complaintId],
                resolutionNotes: notesEdit[complaintId]
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        fetchComplaints();
    };

    const filteredPending = complaints.pending.filter(
        (complaint) =>
            complaint.title.toLowerCase().includes(search.toLowerCase()) ||
            complaint.status.toLowerCase().includes(search.toLowerCase())
    );

    const filteredInProgress = complaints.inProgress.filter(
        (complaint) =>
            complaint.title.toLowerCase().includes(search.toLowerCase()) ||
            complaint.status.toLowerCase().includes(search.toLowerCase())
    );

    const filteredResolved = complaints.resolved.filter(
        (complaint) =>
            complaint.title.toLowerCase().includes(search.toLowerCase()) ||
            complaint.status.toLowerCase().includes(search.toLowerCase())
    );

    const renderComplaintRow = (complaint) => (
        <React.Fragment key={complaint._id}>
            <tr>
                <td><strong>{complaint.title}</strong></td>
                <td>
                    {complaint.status ? (
                        <span className={`badge bg-${statusColors[complaint.status]}`}>
                            {complaint.status.replace('-', ' ')}
                        </span>
                    ) : (
                        <span className="badge bg-secondary">Unknown</span>
                    )}
                </td>
                <td>{complaint.category}</td>
                <td>{formatDueDate(complaint)}</td>
                <td>{complaint.raisedBy?.email}</td>
                <td>
                    {complaint.assignedTo?.email || (
                        <span className="text-muted">Unassigned</span>
                    )}
                </td>
                <td>
                    <select
                        className="form-select"
                        value={complaint.assignedTo?._id || ''}
                        onChange={(e) => handleAssign(complaint._id, e.target.value)}
                    >
                        <option value="">Select Staff to Assign</option>
                        {staffList.map((staff) => (
                            <option key={staff._id} value={staff._id}>
                                {staff.name || staff.email}
                                {staff.department ? ` (${staff.department})` : ''}
                            </option>
                        ))}
                    </select>
                </td>
                <td>
                    <div className="d-flex align-items-center gap-2">
                        <select
                            className="form-select"
                            value={statusEdit[complaint._id] || complaint.status}
                            onChange={(e) =>
                                handleStatusChange(complaint._id, e.target.value)
                            }
                            style={{ minWidth: 120 }}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleStatusUpdate(complaint._id)}
                        >
                            Update
                        </button>
                    </div>
                </td>
                <td>
                    <input
                        type="text"
                        className="form-control"
                        value={
                            notesEdit[complaint._id] !== undefined
                                ? notesEdit[complaint._id]
                                : complaint.resolutionNotes || ''
                        }
                        onChange={(e) =>
                            handleNotesChange(complaint._id, e.target.value)
                        }
                        placeholder="Add notes"
                    />
                </td>
            </tr>

            {complaint.staffUpdates && complaint.staffUpdates.length > 0 && (
                <tr>
                    <td colSpan="9">
                        <div className="bg-light p-3 rounded">
                            <strong>Staff Updates:</strong>
                            <div className="row">
                                {complaint.staffUpdates.map((update, index) => (
                                    <div className="col-md-4 mb-2" key={index}>
                                        <div className="card shadow-sm">
                                            <div className="card-body">
                                                <div
                                                    className="mb-2 text-muted"
                                                    style={{ fontSize: '0.9em' }}
                                                >
                                                    {update.updatedAt
                                                        ? new Date(
                                                              update.updatedAt
                                                          ).toLocaleString()
                                                        : ''}
                                                </div>
                                                <div>{update.remarks}</div>
                                                {update.photoUrl && (
                                                    <img
                                                        src={update.photoUrl}
                                                        alt="Staff update"
                                                        className="img-fluid rounded mt-2"
                                                        style={{ maxHeight: '120px' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );

    return (
        <div className="container py-4">
            <h2 className="mb-4" style={{ color: 'var(--primary-blue)' }}>
                Admin Complaint Dashboard
            </h2>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by title or status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: 400 }}
            />

            <div className="mb-4 d-flex justify-content-center gap-3">
                <button
                    className={`btn btn-lg ${
                        activeTab === 'pending' ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending
                </button>
                <button
                    className={`btn btn-lg ${
                        activeTab === 'inProgress' ? 'btn-warning' : 'btn-outline-warning'
                    }`}
                    onClick={() => setActiveTab('inProgress')}
                >
                    In Progress
                </button>
                <button
                    className={`btn btn-lg ${
                        activeTab === 'resolved' ? 'btn-success' : 'btn-outline-success'
                    }`}
                    onClick={() => setActiveTab('resolved')}
                >
                    Resolved
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="text-center">Loading complaints...</div>}

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle bg-white">
                    <thead className="table-light">
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Due Date</th>
                            <th>Raised By</th>
                            <th>Assigned To</th>
                            <th>Assign</th>
                            <th>Update Status</th>
                            <th>Resolution Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === 'pending' &&
                            filteredPending.map(renderComplaintRow)}
                        {activeTab === 'inProgress' &&
                            filteredInProgress.map(renderComplaintRow)}
                        {activeTab === 'resolved' &&
                            filteredResolved.map(renderComplaintRow)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;