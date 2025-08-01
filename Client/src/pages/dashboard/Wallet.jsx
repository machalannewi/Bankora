import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import axios from "axios";
import "../../global.css"
import { toast } from "sonner";
import BottomNavigation from "./BottomNavigation"
import ProfileHeader from "./Header"
import SavingBanner from "./SavingBanner"
import { UserCog, Wallet, Eye, EyeOff, Copy, Plus, ArrowUpRight, DicesIcon, Send, RefreshCw } from "lucide-react"
import io from 'socket.io-client'
import useUserStore from "@/stores/userStore"
import { useNotifications } from "@/contexts/NotificationContext"
import { useTransactions } from "@/contexts/TransactionContext";
import {
  PhoneIcon,
  SignalIcon,
  LightBulbIcon,
  BellIcon
} from '@heroicons/react/24/solid';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [time, setTime] = useState(new Date())
    const [showBalance, setShowBalance] = useState(true);
    const [showAll, setShowAll] = useState(false)
    const [copySuccess, setCopySuccess] = useState("");
    const { notifications, unreadCount, addNotification, clearNotification, clearAllNotifications } = useNotifications();
    const { transactions, setTransactions} = useTransactions()
    
    const navigate = useNavigate()
    const socketRef = useRef(null)
    const user = useUserStore((state) => state.user)



    // Initialize socket connection and fetch balance
    useEffect(() => {
        if (user?.user.email) {
            // Set initial balance
            setBalance(parseFloat(user?.user.balance))
            setTime(time.getHours())
            
            // Initialize socket connection
            socketRef.current = io('https://bankora.onrender.com')
            
            // Socket event listeners
            socketRef.current.on('connect', () => {
                console.log('Connected to server')
                setIsConnected(true)
                // Join user's room
                socketRef.current.emit('join', user?.user.email)
                socketRef.current.emit('join', user?.user.phone)
            })

            socketRef.current.on('disconnect', () => {
                console.log('Disconnected from server')
                setIsConnected(false)
            })

            // Listen for transaction notifications
            socketRef.current.on('transaction', (data) => {
                console.log('Transaction notification:', data)
                setBalance(data.newBalance)

                console.log(data.message);

                toast.success(data.message, {
                    position: "top-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                })
                
                addNotification({
                message: data.message,
                type: data.type || 'info'
                });
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
    }, [user?.user.email, user?.user.phone, user?.user.balance])
    

    useEffect(() => {
        if(!user?.user) {
          navigate("/login")
        }
    }, [user?.user])

    
    useEffect(() => {
        if (user?.user?.id) {
            axios.get(`https://bankora.onrender.com/api/transactions/${user.user.id}`)
                .then(res => {
                    console.log("Fetched transactions:", res.data);
                    setTransactions(res.data); // This now updates the context
                })
                .catch(err => console.error(err));
        }
    }, [user?.user?.id, setTransactions]);

    console.log(transactions)


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
            const response = await fetch(`https://bankora.onrender.com/api/user/balance/${user?.user.id}`)
            const data = await response.json()

            console.log(data);

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

    const copyToClipboard = async copyText => {
        try {
            await navigator.clipboard.writeText(copyText)
            setCopySuccess("Copied")
            setTimeout(() => {
            setCopySuccess("")
            }, 2000)
        } catch (error) {
            setCopySuccess("Failed to Copy")
            console.error(error.message)
        }
    }

    // Navigate to transfer page
    function sendMoney() {
        navigate("/transfer")
    }

    return (
        <div className="min-h-screen bg-gray-50 font-voyage">
            {/* Header */}
            <ProfileHeader user={user} notificationCount={unreadCount} time={time}/>

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
                    <div className="flex items-center gap-2">
                        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-2">
                        {showBalance ? "$" + balance.toFixed(2) : '••••••••'}
                        </h2>
                        <RefreshCw 
                        onClick={refreshBalance}
                        className="h-8 w-8"/>
                    </div>
                    <div>
                    <p className="text-white/70 text-sm mb-1">Account details</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-white/90 text-base">
                        {user?.user.firstName} {user?.user.lastName} ({user?.user.phone})
                        </span>
                        <Copy className="h-4 w-4 text-white/70 cursor-pointer hover:text-white transition-colors" 
                        onClick={() => copyToClipboard(user?.user.phone)}
                        />
                        <span>{copySuccess}</span>
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
                <div className="mb-4 flex items-center gap-1">
                    <h2 className="text-3xl font-bold text-white">
                        {showBalance ? "$" + balance.toFixed(2, 0) : '••••••••'}
                    </h2>
                    <RefreshCw 
                    onClick={refreshBalance}
                    className="w-4 h-4"/>
                </div>

                {/* Account Details */}
                <div className="mb-6">
                <p className="text-white/70 text-xs mb-1 grid place-content-center">Account details</p>
                <div className="flex items-center space-x-1">
                    <span className="text-white/90 text-sm">
                    {user?.user.firstName} {user?.user.lastName} ({user?.user.phone})
                    </span>
                    <Copy className="h-3 w-3 text-white/70 cursor-pointer hover:text-white transition-colors" 
                    onClick={() => copyToClipboard(user?.user.phone)}
                    />
                    <span className="text-sm">{copySuccess}</span>
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


                <SavingBanner />


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
                        console.log(transaction.receiver_id, typeof transaction.receiver_id);
                        console.log(user?.user.id, typeof user?.user.id);
                        const isCredit = String(transaction.receiver_id) === String(user?.user.id);
                        console.log(isCredit)
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
            </div>
            <BottomNavigation />
        </div>
    )
}

export default Dashboard