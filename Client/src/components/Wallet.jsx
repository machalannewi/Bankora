import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import io from 'socket.io-client'

const Wallet = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const [notifications, setNotifications] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    
    const location = useLocation()
    const navigate = useNavigate()
    const socketRef = useRef(null)
    
    const username = location.state?.userName || "Guest"
    const initialBalance = location.state?.balance || "0.00"
    const userEmail = location.state?.userEmail

    // Initialize socket connection and fetch balance
    useEffect(() => {
        if (userEmail) {
            // Set initial balance
            setBalance(parseFloat(initialBalance))
            
            // Initialize socket connection
            socketRef.current = io('http://localhost:5000')
            
            // Socket event listeners
            socketRef.current.on('connect', () => {
                console.log('Connected to server')
                setIsConnected(true)
                // Join user's room
                socketRef.current.emit('join', userEmail)
            })

            socketRef.current.on('disconnect', () => {
                console.log('Disconnected from server')
                setIsConnected(false)
            })

            // Listen for balance updates
            socketRef.current.on('balanceUpdate', (data) => {
                console.log('Balance update received:', data)
                setBalance(data.newBalance)
                
                // Add notification
                setNotifications(prev => [{
                    id: Date.now(),
                    message: data.message,
                    type: data.type,
                    timestamp: new Date().toLocaleString()
                }, ...prev.slice(0, 4)]) // Keep only last 5 notifications
            })

            // Listen for transaction notifications
            socketRef.current.on('transaction', (data) => {
                console.log('Transaction notification:', data)
                setBalance(data.newBalance)
                
                setNotifications(prev => [{
                    id: Date.now(),
                    message: data.message,
                    type: data.type || 'info',
                    timestamp: new Date().toLocaleString()
                }, ...prev.slice(0, 4)])
            })

            // Fetch latest balance on component mount
            fetchBalance()

            // Cleanup on unmount
            return () => {
                if (socketRef.current) {
                    socketRef.current.disconnect()
                }
            }
        }
    }, [userEmail, initialBalance])

    // Fetch balance from server
    const fetchBalance = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/user/balance', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json()
            if (data.success) {
                setBalance(data.balance)
            }
        } catch (error) {
            console.error('Error fetching balance:', error)
        }
    }

    // Manual refresh balance
    const refreshBalance = () => {
        fetchBalance()
    }

    // Handle logout
    function handleLogOut() {
        setIsLoading(true)
        
        // Disconnect socket
        if (socketRef.current) {
            socketRef.current.disconnect()
        }
        
        localStorage.removeItem("token")
        setTimeout(() => {
            navigate("/")
        }, 2000)
    }

    // Navigate to transfer page
    function sendMoney() {
        navigate("/transfer", {
            state: {
                userEmail: userEmail,
                currentBalance: balance
            }
        })
    }

    // Clear notification
    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }

    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([])
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Header */}
            <div style={{ 
                marginBottom: '20px', 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h2 style={{ margin: 0, color: '#333' }}>Hi {username}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ margin: 0, color: '#2c3e50' }}>
                            Balance: ${balance.toFixed(2)}
                        </h3>
                        <button 
                            onClick={refreshBalance}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
                
                {/* Connection Status */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px',
                    fontSize: '12px',
                    color: isConnected ? '#28a745' : '#dc3545'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isConnected ? '#28a745' : '#dc3545'
                    }}></div>
                    {isConnected ? 'Connected' : 'Disconnected'}
                </div>
            </div>

            {/* Notifications */}
            {notifications.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <h4 style={{ margin: 0, color: '#333' }}>Recent Notifications</h4>
                        <button 
                            onClick={clearAllNotifications}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Clear All
                        </button>
                    </div>
                    {notifications.map(notification => (
                        <div key={notification.id} style={{
                            padding: '10px',
                            margin: '5px 0',
                            backgroundColor: notification.type === 'credit' ? '#d4edda' : 
                                           notification.type === 'debit' ? '#f8d7da' : '#d1ecf1',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                                    {notification.message}
                                </p>
                                <small style={{ color: '#666' }}>
                                    {notification.timestamp}
                                </small>
                            </div>
                            <button 
                                onClick={() => clearNotification(notification.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '20px' 
            }}>
                <button
                    onClick={sendMoney}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    Send Money
                </button>
                <button
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}
                >
                    Receive Money
                </button>
            </div>

            {/* Logout Button */}
            <div>
                <button
                    onClick={handleLogOut}
                    disabled={isLoading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isLoading ? '#6c757d' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '14px'
                    }}
                >
                    {isLoading ? "Logging Out..." : "Log Out"}
                </button>
            </div>
        </div>
    )
}

export default Wallet