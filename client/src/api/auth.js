// filepath: smart-campus-complaint-system/client/src/api/auth.js

import axios from 'axios';
import API_BASE_URL from './config';

// Register user
const register = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
    return response.data;
};

// Export the auth functions
export default {
    register,
    login,
};