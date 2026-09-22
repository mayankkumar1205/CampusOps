import React from 'react';
import { useHistory } from 'react-router-dom';

const CenterPage = () => {
    const history = useHistory();

    return (
        <div className="center-page">
            <h1>Welcome to Kongu Smart Campus Complaint System</h1>
            <div className="role-buttons">
                <button onClick={() => history.push('/login/admin')}>Admin Login</button>
                <button onClick={() => history.push('/login/staff')}>Staff Login</button>
                <button onClick={() => history.push('/login/student')}>Student Login</button>
            </div>
            <div className="role-buttons" style={{ marginTop: '20px' }}>
                <button onClick={() => history.push('/register/admin')}>Admin Signup</button>
                <button onClick={() => history.push('/register/staff')}>Staff Signup</button>
                <button onClick={() => history.push('/register/student')}>Student Signup</button>
            </div>
        </div>
    );
};

export default CenterPage;