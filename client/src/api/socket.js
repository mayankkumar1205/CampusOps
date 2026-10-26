import { io } from 'socket.io-client';
import API_BASE_URL from './config';

const SOCKET_URL =
    process.env.REACT_APP_SOCKET_URL ||
    API_BASE_URL.replace(/\/api\/?$/, '');

let socket = null;

export const connectSocket = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return null;
    }

    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false,
            auth: { token }
        });
    } else {
        socket.auth = { token };
    }

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;