// contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useUserStore from '../store/userStore';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const { user, updateBalance } = useUserStore();

    useEffect(() => {
        // Only create socket if user is authenticated
        if (user && user.id) {
            // Create socket connection
            socketRef.current = io('https://bankora.onrender.com', {
                auth: {
                    userId: user.id,
                    token: useUserStore.getState().token
                }
            });

            const socket = socketRef.current;

            // Listen for balance updates
            socket.on('balance_updated', (data) => {
                if (data.userId === user.id) {
                    updateBalance(data.newBalance);
                    console.log('Balance updated via socket:', data.newBalance);
                }
            });

            // Listen for transfer notifications
            socket.on('transfer_received', (data) => {
                if (data.recipientId === user.id) {
                    updateBalance(data.newBalance);
                    // You can add notification logic here
                    console.log('Transfer received:', data);
                }
            });

            // Listen for transfer sent confirmation
            socket.on('transfer_sent', (data) => {
                if (data.senderId === user.id) {
                    updateBalance(data.newBalance);
                    console.log('Transfer sent confirmed:', data);
                }
            });

            // Connection status handlers
            socket.on('connect', () => {
                console.log('Socket connected');
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [user, updateBalance]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const value = {
        socket: socketRef.current,
        isConnected: socketRef.current?.connected || false
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};