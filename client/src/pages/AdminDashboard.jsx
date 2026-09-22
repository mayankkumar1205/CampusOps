import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusColors = {
  'pending': 'secondary',
  'in-progress': 'warning',
  'resolved': 'success'
};

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState({ pending: [], inProgress: [], resolved: [] });
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
            const res = await axios.get('https://campus-complaint-system.onrender.com/api/complaints', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setComplaints(res.data);
        } catch (err) {
            setError('Failed to fetch complaints');
        }
        setLoading(false);
    };

    const fetchStaff = async () => {
        try {
            const res = await axios.get('https://campus-complaint-system.onrender.com/api/auth/staff', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Staff data received:', res.data);
            // Show all staff, with department if available
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
            
            await axios.put(`https://campus-complaint-system.onrender.com/api/complaints/${complaintId}/assign`, { staffId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log(`Complaint ${complaintId} assigned to staff ${staffId}`);
            fetchComplaints();
        } catch (err) {
            console.error('Error assigning complaint:', err);
            alert(err.response?.data?.message || 'Failed to assign complaint. Please try again.');
        }
    };

    const handleStatusChange = (complaintId, status) => {
        setStatusEdit(prev => ({ ...prev, [complaintId]: status }));
    };

    const handleNotesChange = (complaintId, notes) => {
        setNotesEdit(prev => ({ ...prev, [complaintId]: notes }));
    };

    const handleStatusUpdate = async (complaintId) => {
        await axios.put(`https://campus-complaint-system.onrender.com/api/complaints/${complaintId}/status`, {
            status: statusEdit[complaintId],
            resolutionNotes: notesEdit[complaintId]
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchComplaints();
    };

    const filteredPending = complaints.pending.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.status.toLowerCase().includes(search.toLowerCase())
    );
    const filteredInProgress = complaints.inProgress.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.status.toLowerCase().includes(search.toLowerCase())
    );
    const filteredResolved = complaints.resolved.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.status.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container py-4">
            <h2 className="mb-4" style={{ color: 'var(--primary-blue)' }}>Admin Complaint Dashboard</h2>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by title or status"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ maxWidth: 400 }}
            />
            <div className="mb-4 d-flex justify-content-center gap-3">
                <button className={`btn btn-lg ${activeTab === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('pending')}>Pending</button>
                <button className={`btn btn-lg ${activeTab === 'inProgress' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setActiveTab('inProgress')}>In Progress</button>
                <button className={`btn btn-lg ${activeTab === 'resolved' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setActiveTab('resolved')}>Resolved</button>
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle bg-white">
                    <thead className="table-light">
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Due In (days)</th>
                            <th>Raised By</th>
                            <th>Assigned To</th>
                            <th>Assign</th>
                            <th>Update Status</th>
                            <th>Resolution Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === 'pending' && filteredPending.map(c => (
                            <React.Fragment key={c._id}>
                                <tr>
                                    <td><strong>{c.title}</strong></td>
                                    <td>
                                        {c.status ? (
                                            <span className={`badge bg-${statusColors[c.status]}`}>{c.status.replace('-', ' ')}</span>
                                        ) : (
                                            <span className="badge bg-secondary">Unknown</span>
                                        )}
                                    </td>
                                    <td>{c.category}</td>
                                    <td>{c.dueInDays}</td>
                                    <td>{c.raisedBy?.email}</td>
                                    <td>{c.assignedTo?.email || <span className="text-muted">Unassigned</span>}</td>
                                    <td>
                                        <select
                                            className="form-select"
                                            value={c.assignedTo?._id || ''}
                                            onChange={e => handleAssign(c._id, e.target.value)}
                                        >
                                            <option value="">Select Staff to Assign</option>
                                            {staffList.map(staff => (
                                                <option key={staff._id} value={staff._id}>
                                                    {staff.name || staff.email} {staff.department ? `(${staff.department})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <select
                                                className="form-select"
                                                value={statusEdit[c._id] || c.status}
                                                onChange={e => handleStatusChange(c._id, e.target.value)}
                                                style={{ minWidth: 120 }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleStatusUpdate(c._id)}>Update</button>
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={notesEdit[c._id] !== undefined ? notesEdit[c._id] : (c.resolutionNotes || '')}
                                            onChange={e => handleNotesChange(c._id, e.target.value)}
                                            placeholder="Add notes"
                                        />
                                    </td>
                                </tr>
                                {c.staffUpdates && c.staffUpdates.length > 0 && (
                                    <tr>
                                        <td colSpan="9">
                                            <div className="bg-light p-3 rounded">
                                                <strong>Staff Updates:</strong>
                                                <div className="row">
                                                    {c.staffUpdates.map((u, idx) => (
                                                        <div className="col-md-4 mb-2" key={idx}>
                                                            <div className="card shadow-sm">
                                                                <div className="card-body">
                                                                    <div className="mb-2 text-muted" style={{ fontSize: '0.9em' }}>{u.updatedAt ? new Date(u.updatedAt).toLocaleString() : ''}</div>
                                                                    <div>{u.remarks}</div>
                                                                    {u.photoUrl && (
                                                                        <img src={u.photoUrl} alt="update" className="img-fluid rounded mt-2" style={{ maxHeight: '120px' }} />
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
                        ))}
                        {activeTab === 'inProgress' && filteredInProgress.map(c => (
                            <React.Fragment key={c._id}>
                                <tr>
                                    <td><strong>{c.title}</strong></td>
                                    <td>
                                        {c.status ? (
                                            <span className={`badge bg-${statusColors[c.status]}`}>{c.status.replace('-', ' ')}</span>
                                        ) : (
                                            <span className="badge bg-secondary">Unknown</span>
                                        )}
                                    </td>
                                    <td>{c.category}</td>
                                    <td>{c.dueInDays}</td>
                                    <td>{c.raisedBy?.email}</td>
                                    <td>{c.assignedTo?.email || <span className="text-muted">Unassigned</span>}</td>
                                    <td>
                                        <select
                                            className="form-select"
                                            value={c.assignedTo?._id || ''}
                                            onChange={e => handleAssign(c._id, e.target.value)}
                                        >
                                            <option value="">Select Staff to Assign</option>
                                            {staffList.map(staff => (
                                                <option key={staff._id} value={staff._id}>
                                                    {staff.name || staff.email} {staff.department ? `(${staff.department})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <select
                                                className="form-select"
                                                value={statusEdit[c._id] || c.status}
                                                onChange={e => handleStatusChange(c._id, e.target.value)}
                                                style={{ minWidth: 120 }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleStatusUpdate(c._id)}>Update</button>
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={notesEdit[c._id] !== undefined ? notesEdit[c._id] : (c.resolutionNotes || '')}
                                            onChange={e => handleNotesChange(c._id, e.target.value)}
                                            placeholder="Add notes"
                                        />
                                    </td>
                                </tr>
                                {c.staffUpdates && c.staffUpdates.length > 0 && (
                                    <tr>
                                        <td colSpan="9">
                                            <div className="bg-light p-3 rounded">
                                                <strong>Staff Updates:</strong>
                                                <div className="row">
                                                    {c.staffUpdates.map((u, idx) => (
                                                        <div className="col-md-4 mb-2" key={idx}>
                                                            <div className="card shadow-sm">
                                                                <div className="card-body">
                                                                    <div className="mb-2 text-muted" style={{ fontSize: '0.9em' }}>{u.updatedAt ? new Date(u.updatedAt).toLocaleString() : ''}</div>
                                                                    <div>{u.remarks}</div>
                                                                    {u.photoUrl && (
                                                                        <img src={u.photoUrl} alt="update" className="img-fluid rounded mt-2" style={{ maxHeight: '120px' }} />
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
                        ))}
                        {activeTab === 'resolved' && filteredResolved.map(c => (
                            <React.Fragment key={c._id}>
                                <tr>
                                    <td><strong>{c.title}</strong></td>
                                    <td>
                                        {c.status ? (
                                            <span className={`badge bg-${statusColors[c.status]}`}>{c.status.replace('-', ' ')}</span>
                                        ) : (
                                            <span className="badge bg-secondary">Unknown</span>
                                        )}
                                    </td>
                                    <td>{c.category}</td>
                                    <td>{c.dueInDays}</td>
                                    <td>{c.raisedBy?.email}</td>
                                    <td>{c.assignedTo?.email || <span className="text-muted">Unassigned</span>}</td>
                                    <td>
                                        <select
                                            className="form-select"
                                            value={c.assignedTo?._id || ''}
                                            onChange={e => handleAssign(c._id, e.target.value)}
                                        >
                                            <option value="">Select Staff to Assign</option>
                                            {staffList.map(staff => (
                                                <option key={staff._id} value={staff._id}>
                                                    {staff.name || staff.email} {staff.department ? `(${staff.department})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <select
                                                className="form-select"
                                                value={statusEdit[c._id] || c.status}
                                                onChange={e => handleStatusChange(c._id, e.target.value)}
                                                style={{ minWidth: 120 }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                            <button className="btn btn-sm btn-primary" onClick={() => handleStatusUpdate(c._id)}>Update</button>
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={notesEdit[c._id] !== undefined ? notesEdit[c._id] : (c.resolutionNotes || '')}
                                            onChange={e => handleNotesChange(c._id, e.target.value)}
                                            placeholder="Add notes"
                                        />
                                    </td>
                                </tr>
                                {c.staffUpdates && c.staffUpdates.length > 0 && (
                                    <tr>
                                        <td colSpan="9">
                                            <div className="bg-light p-3 rounded">
                                                <strong>Staff Updates:</strong>
                                                <div className="row">
                                                    {c.staffUpdates.map((u, idx) => (
                                                        <div className="col-md-4 mb-2" key={idx}>
                                                            <div className="card shadow-sm">
                                                                <div className="card-body">
                                                                    <div className="mb-2 text-muted" style={{ fontSize: '0.9em' }}>{u.updatedAt ? new Date(u.updatedAt).toLocaleString() : ''}</div>
                                                                    <div>{u.remarks}</div>
                                                                    {u.photoUrl && (
                                                                        <img src={u.photoUrl} alt="update" className="img-fluid rounded mt-2" style={{ maxHeight: '120px' }} />
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;