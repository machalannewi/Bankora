import { useState, useEffect, useCallback } from "react"
import { useLocation, Link } from "react-router-dom"
import { ArrowLeft, Send, User, DollarSign, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import io from 'socket.io-client'
import useUserStore from "@/stores/userStore"

const TransferMoney = () => {
  const [isTransferLoading, setIsTransferLoading] = useState(false) // Separate loading for transfer
  const [isUserSearchLoading, setIsUserSearchLoading] = useState(false) // Separate loading for user search
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(0);
  const [socket, setSocket] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [fetchUser, setFetchUser] = useState("");
  const [transferData, setTransferData] = useState({
    receiverIdentifier: "",
    amount: ""
  })

  const user = useUserStore((state) => state.user)

  // Debounced function to fetch user
  const debouncedFetchUser = useCallback(
    debounce(async (value) => {
      setIsUserSearchLoading(true);
      setError(''); // Clear previous errors
      
      try {
        const res = await fetch(`http://localhost:5000/api/user/fetch-user/${user?.user.id}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverIdentifier: value.trim()
          })
        })
        
        const data = await res.json();
        console.log('API Response:', data);
        
        if (res.ok && data.success) {
          const userFullName = data.user.first_name + " " + data.user.last_name
          setFetchUser(userFullName);
        } else {
          setFetchUser(""); // Clear user if not found
          if (data.message) {
            setError(data.message);
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError("Error fetching user: " + error.message);
        setFetchUser(""); // Clear user on error
      } finally {
        setIsUserSearchLoading(false);
      }
    }, 500), // Wait 500ms after user stops typing
    [user?.user.id] // Dependencies
  );

  const handleChange = (e) => {
    const { name, value } = e.target
    setTransferData({ ...transferData, [name]: value })
   
    // Only fetch user when typing in the receiverIdentifier field and has some value
    if (name === 'receiverIdentifier' && value.trim()) {
      debouncedFetchUser(value);
    } else if (name === 'receiverIdentifier' && !value.trim()) {
      // Clear the fetched user when input is empty
      setFetchUser("");
      setError(''); // Clear errors
      setIsUserSearchLoading(false); // Stop loading
    }
  }

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedFetchUser.cancel?.();
    }
  }, [debouncedFetchUser]);

 // Transfer money function
  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsTransferLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:5000/api/transactions/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          senderEmail: user?.user.email,
          receiverIdentifier: transferData.receiverIdentifier,
          amount: parseFloat(transferData.amount),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Transfer successful!');
        setBalance(data.transaction.senderNewBalance);
        setTransferData({ receiverIdentifier: '', amount: '' });
        setFetchUser(''); // Clear fetched user after successful transfer
        setTimeout(() => setSuccess(""), 5000)
      } else {
        setError(data.message || 'Transfer failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Transfer error:', err);
    } finally {
      setIsTransferLoading(false);
    }
  };

  const formatBalance = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Improved form validation
  const isFormValid = transferData.receiverIdentifier.trim() && 
                     transferData.amount && 
                     parseFloat(transferData.amount) > 0 && 
                     fetchUser; // Only valid if user is found

  return (
    <div className="font-voyage min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/wallet" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Send Money</h1>
            <div className="w-9"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Transfer Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Transfer Money</h2>
              <p className="text-gray-500 text-sm">Send money to friends and family</p>
            </div>
          </div>

          <form onSubmit={handleTransfer} className="space-y-6">
            {/* Recipient Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Recipient
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="receiverIdentifier"
                  value={transferData.receiverIdentifier}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter email or phone number"
                />
              </div>
              {/* Loading state for user search */}
              {isUserSearchLoading && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Searching for user...</span>
                </div>
              )}
              
              {/* Display found user */}
              {fetchUser && !isUserSearchLoading && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-green-800 text-sm font-medium">
                      Recipient: {fetchUser}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={transferData.amount}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {transferData.amount && (
                <p className="text-sm text-gray-500">
                  You'll send {formatBalance(parseFloat(transferData.amount || 0))}
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTransferData({...transferData, amount: amount.toString()})}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Transfer Button */}
            <button
              type="submit"
              disabled={isTransferLoading || !isFormValid}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                isTransferLoading || !isFormValid
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl'
              }`}
            >
              {isTransferLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Money
                </>
              )}
            </button>
          </form>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Transfer Successful!</p>
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="text-blue-800 font-medium text-sm">Secure Transfer</p>
              <p className="text-blue-600 text-xs mt-1">
                Your transfer is protected by bank-level encryption and security measures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple debounce function (if you don't have lodash)
function debounce(func, wait) {
  let timeout;
  const debounced = function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  
  return debounced;
}

export default TransferMoney