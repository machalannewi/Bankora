import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import axios from "axios";
import BottomNavigation from "./BottomNavigation"
import { UserCog, Wallet, Eye, EyeOff, Copy, Plus, ArrowUpRight, DicesIcon, Send } from "lucide-react"
import io from 'socket.io-client'
import useUserStore from "@/stores/userStore"
import {
  PhoneIcon,
  SignalIcon,
  LightBulbIcon,
  BellIcon
} from '@heroicons/react/24/solid';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const [notifications, setNotifications] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [time, setTime] = useState(new Date())
    const [showBalance, setShowBalance] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [showAll, setShowAll] = useState(false)


    


    
    
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
            setTime(time.getHours())
            
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

    
    useEffect(() => {
    axios.get(`http://localhost:5000/api/transactions/${user?.user.id}`)
        .then(res => {
        console.log("Fetched transactions:", res.data);
        setTransactions(res.data);
        })
        .catch(err => console.error(err));
    }, [user?.user.id]);

    console.log(transactions)


    // const isCredit = transactions.receiver_id === user?.user.id;
    // const name = isCredit ? transactions.sender_name : transactions.receiver_name;



  const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  const day = date.getDate();
  const ordinal = day + (day > 3 && day < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th');
  
  const month = date.toLocaleDateString('en-GB', {
    month: 'short',
  });

  console.log(month)
  const year = date.toLocaleDateString('en-GB', {
    year: 'numeric',
  });
  
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  return `${ordinal} ${month}, ${year} | ${time}`;
};



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
        console.log(time)
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">W</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                   {time < 12
                                    ? "Good Morning"
                                    : time >= 12 && time < 18
                                    ? "Good Afternoon"
                                    : "Good Evening"},
                                </p>
                                <p className="font-semibold">{user?.user.username}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">      
                            {/* Logout Button */}
                            {/* <button
                                onClick={handleLogOut}
                                disabled={isLoading}
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Logging Out..." : "Log Out"}
                            </button> */}
                            <div className="w-10 h-10 text-black bg-blue-100 rounded-full flex items-center justify-center">
                                <UserCog />
                            </div>
                            <div className="w-10 h-10 text-black bg-blue-100 rounded-full flex items-center justify-center">
                                <BellIcon className="h-6"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 text-white shadow-xl max-w-md md:max-w-5xl lg:max-w-7xl mx-auto mb-8 -mt-4">
            {/* Desktop Layout */}
            <div className="hidden md:flex md:justify-between md:items-start">
                {/* Left Section - Balance Info */}
                <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-white/80" />
                    <p className="text-white/80 text-base font-medium">Wallet Balance</p>
                    </div>
                    <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                    {showBalance ? <EyeOff className="w-5 h-5 text-white/80" /> : <Eye className="w-5 h-5 text-white/80" />}
                    </button>
                </div>
                <div className="mb-6">
                    <h2 className="text-5xl lg:text-6xl font-bold text-white mb-2">
                    {showBalance ? "$" + balance.toFixed(2, 0) : '••••••••'}
                    </h2>
                    <div>
                    <p className="text-white/70 text-sm mb-1">Account details</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-white/90 text-base">
                        {user?.user.firstName} {user?.user.lastName} ({user?.user.phone})
                        </span>
                        <Copy className="h-4 w-4 text-white/70 cursor-pointer hover:text-white transition-colors" />
                    </div>
                    </div>
                </div>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="flex flex-col space-y-3 ml-8">
                <button 
                onClick={sendMoney}
                className="flex items-center space-x-3 bg-white text-blue-700 px-6 py-3 rounded-full text-base font-medium hover:bg-white/90 transition-colors min-w-max">
                    <div className="w-6 h-6 text-white bg-blue-700 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <span>Transfer</span>
                </button>
                <button className="flex items-center space-x-3 border border-white/30 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-white/10 transition-colors min-w-max">
                    <div className="w-6 h-6 text-white bg-blue-700 rounded-full flex items-center justify-center">
                      <Plus className="h-5 w-5" />
                    </div>
                    <span>Add Money</span>
                </button>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden grid place-items-center">
                {/* Header with wallet icon and balance text */}
                <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-white/80" />
                    <p className="text-white/80 text-sm font-medium">Wallet Balance</p>
                </div>
                <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    {showBalance ? <EyeOff className="w-4 h-4 text-white/80" /> : <Eye className="w-4 h-4 text-white/80" />}
                </button>
                </div>

                {/* Balance Amount */}
                <div className="mb-4">
                <h2 className="text-3xl font-bold text-white">
                    {showBalance ? "$" + balance.toFixed(2, 0) : '••••••••'}
                </h2>
                </div>

                {/* Account Details */}
                <div className="mb-6">
                <p className="text-white/70 text-xs mb-1 grid place-content-center">Account details</p>
                <div className="flex items-center space-x-1">
                    <span className="text-white/90 text-sm">
                    {user?.user.firstName} {user?.user.lastName} ({user?.user.phone})
                    </span>
                    <Copy className="h-3 w-3 text-white/70 cursor-pointer hover:text-white transition-colors" />
                </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                <button
                 onClick={sendMoney}
                 className="flex items-center space-x-2 bg-white text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                    <div className="w-6 h-6 text-white bg-blue-700 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                    <span>Transfer</span>
                </button>
                <button className="flex items-center space-x-2 border border-white text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                    <div className="w-6 h-6 text-white bg-blue-700 rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4" />
                    </div>
                    <span>Add Money</span>
                </button>
                </div>
            </div>
            </div>

                {/* Quick Actions */}
                    
                <div className="mb-4 font-semibold flex justify-between">
                    <p className="md:text-lg">Quick Access</p>
                    <p className="text-blue-800 text-sm cursor-pointer">View All</p>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={sendMoney}
                        className="bg-blue-100 md:h-32 p-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                    <div className="flex items-center justify-center w-full">
                    <div className="text-center">
                        <PhoneIcon className="mx-auto h-6 md:h-12 text-sm my-2 text-blue-800" />
                        <p className="font-semibold text-sm text-gray-900">Airtime</p>
                    </div>
                    </div>

                    </button>
                    <button
                        onClick={sendMoney}
                        className="bg-blue-100 md:h-32 p-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                    <div className="flex items-center justify-center w-full">
                    <div className="text-center">
                        <SignalIcon className="mx-auto h-6 md:h-12 text-sm md:text-2xl my-2 text-blue-800" />
                        <p className="font-semibold text-sm text-gray-900">Internet</p>
                    </div>
                    </div>

                    </button>
                    <button
                        onClick={sendMoney}
                        className="bg-blue-100 p-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                    <div className="flex items-center justify-center w-full">
                    <div className="text-center">
                        <LightBulbIcon  className="mx-auto h-6 md:h-12 text-sm my-2 mb-2 text-blue-800" />
                        <p className="font-semibold text-sm text-gray-900">Electricity</p>
                    </div>
                    </div>

                    </button>
                    <button
                        onClick={sendMoney}
                        className="bg-blue-100 p-2 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                    >
                    <div className="flex items-center justify-center w-full">
                    <div className="text-center">
                        <DicesIcon className="mx-auto my-2 mb-2 text-blue-800" />
                        <p className="font-semibold text-sm text-gray-900">Betting</p>
                    </div>
                    </div>

                    </button>



                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="md:text-lg font-semibold text-gray-900">Transactions</h3>
                        <button 
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-blue-800 hover:text-blue-800 font-semibold cursor-pointer">
                           {showAll ? "Show less" : "View All"}
                        </button>
                    </div>

                    <div className="space-y-4">
                    {(showAll ? transactions : transactions.slice(0, 3)).map((transaction) => {
                        const isCredit = transaction.receiver_id === user?.user.id;
                        const name = isCredit ? transaction.sender_name : transaction.receiver_name;

                        return (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isCredit ? 'bg-green-100' : 'bg-red-100'
                                }`}
                            >
                                {isCredit ? (
                                <Send className="text-green-600 rotate-90" />
                                ) : (
                                <Send className="text-red-600" />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{name}</p>
                                <p className="text-sm text-gray-500">
                                {formatDateTime(transaction.created_at)}
                                </p>
                            </div>
                            </div>

                            <div className="text-right">
                            <p
                                className="font-semibold text-black"
                            >
                                {isCredit ? '+' : '-'}${Number(transaction.amount).toLocaleString()}
                            </p>
                            <p className="text-sm text-green-600">{transaction.status === "completed" ? "Successful" : "Failed" }</p>
                            </div>
                        </div>
                        );
                    })}
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

                {/* Stats Cards
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
                </div> */}
            </div>
            <BottomNavigation />
        </div>
    )
}

export default Dashboard