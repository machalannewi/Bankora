import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import io from 'socket.io-client'
import useUserStore from "@/stores/userStore"

const Wallet = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const [notifications, setNotifications] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    
    // const location = useLocation()
    const navigate = useNavigate()
    const socketRef = useRef(null)
    const user = useUserStore((state) => state.user)
    
    // const username = location.state?.userName || "Guest"
    // const initialBalance = location.state?.balance || "0.00"
    // const userEmail = location.state?.userEmail

    // Initialize socket connection and fetch balance
    useEffect(() => {
        if (user?.user.email) {
            // Set initial balance
            setBalance(parseFloat(user?.user.balance))
            
            // Initialize socket connection
            socketRef.current = io('http://localhost:5000')
            
            // Socket event listeners
            socketRef.current.on('connect', () => {
                console.log('Connected to server')
                setIsConnected(true)
                // Join user's room
                socketRef.current.emit('join', user?.user.email)
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
    }, [user?.user.email, user?.user.balance])


    useEffect(() => {
        if(!user?.user) {
          navigate("/login")
        }
    }, [user?.user])

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
            navigate("/login")
        }, 2000)
    }

    // Navigate to transfer page
    function sendMoney() {
        navigate("/transfer")
    }

    // Clear notification
    const clearNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }

    // Clear all notifications
    const clearAllNotifications = () => {
        setNotifications([])
    }

    // Mock data for recent transactions
    const recentTransactions = [
        { id: 1, type: 'credit', amount: 250.00, description: 'Salary Credit', date: '2025-01-15', from: 'Company Ltd' },
        { id: 2, type: 'debit', amount: 45.50, description: 'Online Shopping', date: '2025-01-14', to: 'E-commerce Store' },
        { id: 3, type: 'credit', amount: 120.00, description: 'Freelance Payment', date: '2025-01-13', from: 'Client ABC' },
        { id: 4, type: 'debit', amount: 30.00, description: 'Coffee & Snacks', date: '2025-01-12', to: 'Cafe Corner' },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">W</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
                                <p className="text-sm text-gray-600">Welcome back, {user?.user.username}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Connection Status */}
                            {/* <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </span>
                            </div> */}
                            
                            {/* Logout Button */}
                            <button
                                onClick={handleLogOut}
                                disabled={isLoading}
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Logging Out..." : "Log Out"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Balance Card */}
                <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-300 text-sm font-medium mb-2">Total Balance</p>
                            <div className="flex items-center space-x-4">
                                <h2 className="text-4xl font-bold">${balance.toFixed(2)}</h2>
                                <button 
                                    onClick={refreshBalance}
                                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                    title="Refresh Balance"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-300 text-sm">Account Status</p>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={sendMoney}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-600">Send Money</p>
                                <p className="text-lg font-semibold text-gray-900">Transfer</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-600">Receive Money</p>
                                <p className="text-lg font-semibold text-gray-900">Request</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-600">Add Money</p>
                                <p className="text-lg font-semibold text-gray-900">Top Up</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                    </button>

                    <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-600">View History</p>
                                <p className="text-lg font-semibold text-gray-900">Transactions</p>
                            </div>
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                            <button className="text-sm text-black hover:text-gray-700 font-medium">View All</button>
                        </div>
                        <div className="space-y-4">
                            {recentTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                            {transaction.type === 'credit' ? (
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{transaction.description}</p>
                                            <p className="text-sm text-gray-500">
                                                {transaction.type === 'credit' ? `From: ${transaction.from}` : `To: ${transaction.to}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-semibold ${
                                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">{transaction.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                            {notifications.length > 0 && (
                                <button 
                                    onClick={clearAllNotifications}
                                    className="text-sm text-black hover:text-gray-700 font-medium"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        
                        {notifications.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 01-7.5-7.5H2.5A10 10 0 0012.5 2c5.523 0 10 4.477 10 10a10 10 0 01-10 10z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm">No new notifications</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notifications.map(notification => (
                                    <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${
                                        notification.type === 'credit' ? 'bg-green-50 border-green-400' : 
                                        notification.type === 'debit' ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-400'
                                    }`}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {notification.timestamp}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => clearNotification(notification.id)}
                                                className="text-gray-400 hover:text-gray-600 p-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">$1,234.56</p>
                                <p className="text-sm text-green-600">+12% from last month</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-gray-900">$567.89</p>
                                <p className="text-sm text-red-600">+8% from last month</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Savings Goal</p>
                                <p className="text-2xl font-bold text-gray-900">68%</p>
                                <p className="text-sm text-blue-600">$680 of $1,000</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallet