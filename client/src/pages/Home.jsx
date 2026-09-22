import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Home = ({ userEmail, userRole }) => {
    const history = useHistory();
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState({ total: 0, resolved: 0, users: 0, responseTime: 0 });

    useEffect(() => {
        let isMounted = true;
        // Fetch public feedbacks for testimonials
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get('https://campus-complaint-system.onrender.com/api/feedback');
                if (isMounted) setFeedbacks(res.data.slice(-6)); // Show last 6 feedbacks
            } catch (error) {
                if (isMounted) console.error('Error fetching feedbacks:', error);
            }
        };

        // Fetch real statistics
        const fetchStats = async () => {
            try {
                console.log('Fetching statistics...');
                const [complaintsRes, usersRes] = await Promise.all([
                    axios.get('https://campus-complaint-system.onrender.com/api/stats/complaints'),
                    axios.get('https://campus-complaint-system.onrender.com/api/stats/users')
                ]);
                
                console.log('Complaint stats response:', complaintsRes.data);
                console.log('User stats response:', usersRes.data);
                
                const complaintStats = complaintsRes.data;
                const userStats = usersRes.data;
                
                const newStats = {
                    resolved: complaintStats.resolved || 0,
                    users: userStats.total || 0,
                    responseTime: complaintStats.avgResponseTime || 24
                };
                
                console.log('Setting stats to:', newStats);
                if (isMounted) setStats(newStats);
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching stats:', error);
                    console.error('Error details:', error.response?.data);
                    // Fallback to default values if API fails
                    setStats({ total: 0, resolved: 0, users: 0, responseTime: 24 });
                }
            }
        };

        fetchFeedbacks();
        fetchStats();
        return () => { isMounted = false; };
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section text-white py-5" style={{ 
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4">Smart Campus Complaint System</h1>
                            <h3 className="mb-4" style={{ color: '#FFD700' }}>Kongu Engineering College</h3>
                            <p className="lead mb-4">Empowering students, staff, and administrators with a transparent and efficient complaint management system. Experience seamless issue resolution and real-time tracking.</p>
                        {!userEmail && (
                                <div className="d-flex gap-3">
                                    <button className="btn btn-warning btn-lg px-4" onClick={() => history.push('/login/student')}>
                                        <i className="fas fa-sign-in-alt me-2"></i>Login
                                    </button>
                                    <button className="btn btn-outline-light btn-lg px-4" onClick={() => history.push('/register/student')}>
                                        <i className="fas fa-user-plus me-2"></i>Register
                                    </button>
                            </div>
                        )}
                        {userEmail && (
                                <div className="alert alert-success d-inline-block">
                                    <i className="fas fa-user me-2"></i>Welcome back, <strong>{userEmail}</strong> ({userRole})
                                </div>
                            )}
                        </div>
                        <div className="col-lg-6 text-center">
                            <div className="hero-image">
                                <i className="fas fa-university" style={{ fontSize: '15rem', opacity: 0.3 }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions for Logged In Users */}
            {userEmail && (
                <div id="submit-complaint" className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow-lg border-0">
                                <div className="card-body text-center p-4">
                                    <h4 className="mb-4" style={{ color: 'var(--primary-blue)' }}>Quick Actions</h4>
                                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                                        {userRole === 'student' && (
                                            <>
                                                <button className="btn btn-primary btn-lg" onClick={() => history.push('/complaints/new')}>
                                                    <i className="fas fa-plus-circle me-2"></i>Submit Complaint
                                                </button>
                                                <button className="btn btn-info btn-lg" onClick={() => history.push('/my-complaints')}>
                                                    <i className="fas fa-list me-2"></i>My Complaints
                                                </button>
                                                
                                            </>
                                        )}
                                        {userRole === 'staff' && (
                                            <button className="btn btn-primary btn-lg" onClick={() => history.push('/staff/dashboard')}>
                                                <i className="fas fa-tasks me-2"></i>Staff Dashboard
                                            </button>
                                        )}
                                        {userRole === 'admin' && (
                                            <button className="btn btn-primary btn-lg" onClick={() => history.push('/admin/dashboard')}>
                                                <i className="fas fa-cog me-2"></i>Admin Dashboard
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            
            {/* Features Section */}
            <div className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold" style={{ color: 'var(--primary-blue)' }}>Why Choose Our System?</h2>
                    <p className="lead text-muted">Experience the future of campus complaint management</p>
                </div>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4">
                            <div className="card-body">
                                <i className="fas fa-bolt text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                                <h5 className="card-title">Quick Resolution</h5>
                                <p className="card-text">Get your complaints addressed promptly with our streamlined workflow and real-time updates.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4">
                            <div className="card-body">
                                <i className="fas fa-shield-alt text-success mb-3" style={{ fontSize: '3rem' }}></i>
                                <h5 className="card-title">Transparent Process</h5>
                                <p className="card-text">Track every step of your complaint from submission to resolution with complete transparency.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm text-center p-4">
                            <div className="card-body">
                                <i className="fas fa-mobile-alt text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                                <h5 className="card-title">Easy Access</h5>
                                <p className="card-text">Submit and track complaints from anywhere using our responsive web platform.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="bg-light py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold" style={{ color: 'var(--primary-blue)' }}>System Statistics</h2>
                        <p className="lead text-muted">Our commitment to excellence in numbers</p>
                    </div>
                    <div className="row text-center">
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 bg-primary text-white">
                                <div className="card-body p-4">
                                    <i className="fas fa-clipboard-list mb-3" style={{ fontSize: '3rem' }}></i>
                                    <h3 className="display-4 fw-bold">{stats.resolved}+</h3>
                                    <p className="lead">Complaints Resolved</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 bg-success text-white">
                                <div className="card-body p-4">
                                    <i className="fas fa-users mb-3" style={{ fontSize: '3rem' }}></i>
                                    <h3 className="display-4 fw-bold">{stats.users}+</h3>
                                    <p className="lead">Active Users</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 bg-warning text-white">
                                <div className="card-body p-4">
                                    <i className="fas fa-clock mb-3" style={{ fontSize: '3rem' }}></i>
                                    <h3 className="display-4 fw-bold">{stats.responseTime}h</h3>
                                    <p className="lead">Average Response Time</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div id="feedback" className="container py-5">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold" style={{ color: 'var(--primary-blue)' }}>What Our Users Say</h2>
                    <p className="lead text-muted">Real feedback from our campus community</p>
                </div>
                <div className="row g-4">
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback, index) => (
                            <div className="col-md-6 col-lg-4" key={feedback._id}>
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                                                <i className="fas fa-user"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-0">{feedback.userId?.name || 'Anonymous'}</h6>
                                                <small className="text-muted">{feedback.userId?.email}</small>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`fas fa-star ${i < feedback.rating ? 'text-warning' : 'text-muted'}`}></i>
                                            ))}
                                        </div>
                                        <p className="card-text">{feedback.comment || 'Great service and quick resolution!'}</p>
                                        <small className="text-muted">
                                            <i className="fas fa-calendar me-1"></i>
                                            {new Date(feedback.submittedAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-muted">No feedback available yet. Be the first to share your experience!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <h5 className="mb-3" style={{ color: '#FFD700' }}>Kongu Engineering College</h5>
                            <p className="mb-3">Empowering students with innovative technology solutions for a better campus experience.</p>
                            <div className="d-flex gap-3">
                                <button className="btn btn-link text-white p-0 border-0 bg-transparent">
                                    <i className="fab fa-facebook-f"></i>
                                </button>
                                <button className="btn btn-link text-white p-0 border-0 bg-transparent">
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button className="btn btn-link text-white p-0 border-0 bg-transparent">
                                    <i className="fab fa-linkedin-in"></i>
                                </button>
                                <button className="btn btn-link text-white p-0 border-0 bg-transparent">
                                    <i className="fab fa-instagram"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 mb-4">
                            <h6 className="mb-3" style={{ color: '#FFD700' }}>Quick Links</h6>
                            <ul className="list-unstyled">
                                <li><button className="btn btn-link text-white-50 text-decoration-none p-0 border-0 bg-transparent">About Us</button></li>
                                <li><button className="btn btn-link text-white-50 text-decoration-none p-0 border-0 bg-transparent">Contact</button></li>
                                <li><button className="btn btn-link text-white-50 text-decoration-none p-0 border-0 bg-transparent">Help Center</button></li>
                                <li><button className="btn btn-link text-white-50 text-decoration-none p-0 border-0 bg-transparent">Privacy Policy</button></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <h6 className="mb-3" style={{ color: '#FFD700' }}>Departments</h6>
                            <ul className="list-unstyled">
                                <li><button className="btn btn-link text-white-50 text-decoration-none p-0 border-0 bg-transparent">Computer Science</button></li>
                                <li><button className="btn btn-link text-white-50 text-decoration-none p-0 border-0 bg-transparent">Information Technology</button></li>
                                <li><button className="btn btn-link text-white-50 text-decoration-none p-0 border-0 bg-transparent">Mechanical Engineering</button></li>
                                <li><button className="btn btn-link text-white-50 text-decoration-none p-0 border-0 bg-transparent">Electrical Engineering</button></li>
                            </ul>
                        </div>
                        <div className="col-lg-3 mb-4">
                            <h6 className="mb-3" style={{ color: '#FFD700' }}>Contact Info</h6>
                            <p className="mb-2"><i className="fas fa-map-marker-alt me-2"></i>Perundurai, Erode, Tamil Nadu</p>
                            <p className="mb-2"><i className="fas fa-phone me-2"></i>+91 4294 226565</p>
                            <p className="mb-2"><i className="fas fa-envelope me-2"></i>info@kongu.ac.in</p>
                        </div>
                    </div>
                    <hr className="my-4" />
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p className="mb-0">&copy; 2025 Kongu Engineering College. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p className="mb-0">Smart Campus Complaint System v1.0</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;