import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ComplaintForm from './components/Complaint/ComplaintForm';
import MyComplaints from './pages/MyComplaints';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import { jwtDecode } from 'jwt-decode';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role);
                setUserEmail(decoded.role === 'admin' ? 'Admin' : decoded.email);
                setUserInfo({
                    name: decoded.name,
                    department: decoded.department,
                    email: decoded.email
                });
            } catch (e) {
                setUserRole('');
                setUserEmail('');
                setUserInfo({});
            }
        } else {
            setUserRole('');
            setUserEmail('');
            setUserInfo({});
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole('');
        setUserEmail('');
        setUserInfo({});
        window.location.href = '/';
    };

    const handleLoginSuccess = (response, history) => {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        setUserRole(response.data.user.role);
        setUserEmail(response.data.user.role === 'admin' ? 'Admin' : response.data.user.email);
        setUserInfo({
            name: response.data.user.name,
            department: response.data.user.department,
            email: response.data.user.email
        });
        if (response.data.user.role === 'admin') {
            history.push('/admin/dashboard');
        } else if (response.data.user.role === 'staff') {
            history.push('/staff/dashboard');
        } else {
            history.push('/');
        }
    };

    return (
        <Router>
            <Navbar 
                isLoggedIn={isLoggedIn} 
                onLogout={handleLogout} 
                userRole={userRole} 
                userEmail={userEmail} 
                userInfo={userInfo}
            />
            <Switch>
                <Route path="/login/:role" render={(props) => (
                    isLoggedIn ? <Redirect to="/" /> : <Login {...props} setIsLoggedIn={setIsLoggedIn} onLoginSuccess={handleLoginSuccess} />
                )} />
                <Route path="/register/:role" render={(props) => (
                    isLoggedIn ? <Redirect to="/" /> : <Register {...props} />
                )} />
                <Route path="/complaints/new">
                    {isLoggedIn && userRole !== 'admin' ? <ComplaintForm /> : <Redirect to="/admin/dashboard" />}
                </Route>
                <Route path="/my-complaints">
                    {isLoggedIn && userRole !== 'admin' ? <MyComplaints /> : <Redirect to="/admin/dashboard" />}
                </Route>
                <Route path="/complaints/:id">
                    {isLoggedIn && userRole !== 'admin' ? <ComplaintDetail /> : <Redirect to="/admin/dashboard" />}
                </Route>
                <Route path="/admin/dashboard">
                    {isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Redirect to="/login/admin" />}
                </Route>
                <Route path="/staff/dashboard">
                    {isLoggedIn && userRole === 'staff' ? <StaffDashboard /> : <Redirect to="/login/staff" />}
                </Route>
                <Route path="/" exact>
                    <Home userEmail={userEmail} userRole={userRole} />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;