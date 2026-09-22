import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpeg'; // Add your logo to client/src/assets/

const Navbar = ({ isLoggedIn, onLogout, userRole, userEmail, userInfo }) => {
    const history = useHistory();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getActiveClass = (path) => {
        return isActive(path) ? 'active' : '';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'var(--primary-blue)' }}>
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src={logo} alt="Kongu Engineering College" height="40" className="me-2" />
                    <span style={{ fontWeight: 700, letterSpacing: 1 }}>Kongu Engineering College</span>
                </Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    {isLoggedIn ? (
                        <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                            {/* Navigation Links */}
                            <li className="nav-item me-3">
                                <Link className={`nav-link ${getActiveClass('/')}`} to="/">Home</Link>
                            </li>
                            
                            {/* Admin Navigation */}
                            {userRole === 'admin' && (
                                <li className="nav-item me-3">
                                    <Link className={`nav-link ${getActiveClass('/admin/dashboard')}`} to="/admin/dashboard">Dashboard</Link>
                                </li>
                            )}
                            
                            {/* Staff Navigation */}
                            {userRole === 'staff' && (
                                <li className="nav-item me-3">
                                    <Link className={`nav-link ${getActiveClass('/staff/dashboard')}`} to="/staff/dashboard">Dashboard</Link>
                                </li>
                            )}
                            
                            {/* Student Navigation */}
                            {userRole === 'student' && (
                                <>
                                    <li className="nav-item me-3">
                                        <Link className={`nav-link ${getActiveClass('/my-complaints')}`} to="/my-complaints">My Complaints</Link>
                                    </li>
                                    <li className="nav-item me-3">
                                        <Link className={`nav-link ${getActiveClass('/complaints/new')}`} to="/complaints/new">Submit Complaint</Link>
                                    </li>
                                </>
                            )}

                            {/* Profile Information - Simple Display */}
                            <li className="nav-item me-3">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-user me-2 text-warning"></i>
                                    <div className="text-white">
                                        <div className="small fw-bold">{userInfo?.name || 'User'}</div>
                                        <div className="small opacity-75">{userRole?.toUpperCase()}</div>
                                    </div>
                                </div>
                            </li>

                            {/* User Details */}
                            <li className="nav-item me-3">
                                <div className="text-white">
                                    <div className="small">{userEmail}</div>
                                    {userInfo?.department && (
                                        <div className="small opacity-75">{userInfo.department}</div>
                                    )}
                                </div>
                            </li>

                            {/* Logout */}
                            <li className="nav-item">
                                <button className="btn btn-warning" onClick={onLogout}>Logout</button>
                            </li>
                        </ul>
                    ) : (
                        <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item me-2">
                                <button className="btn btn-outline-light" onClick={() => history.push('/login/student')}>Login</button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-warning" onClick={() => history.push('/register/student')}>Register</button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

// Usage example:
// <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} userRole={userRole} userEmail={userEmail} />