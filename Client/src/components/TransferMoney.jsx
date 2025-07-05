// Enhanced TransferMoney component with real-time updates
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import io from 'socket.io-client'

const TransferMoney = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(0);
  const [socket, setSocket] = useState(null);
  const [transferData, setTransferData] = useState({
    receiverIdentifier: "",
    amount: ""
  })
  
  const location = useLocation()
  const email = location.state?.userEmail

  // Initialize socket connection and fetch initial balance
  useEffect(() => {
    if (email) {
      // Initialize socket
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      // Join user's room
      newSocket.emit('join', email);

      // Listen for balance updates
      newSocket.on('balanceUpdate', (data) => {
        setBalance(data.newBalance);
        if (data.type === 'credit') {
          setSuccess(data.message);
          setTimeout(() => setSuccess(''), 5000);
        }
      });

      // Fetch initial balance
      fetchBalance();

      // Cleanup on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [email]);

  // Fetch balance function
  const fetchBalance = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  function handleChange(e) {
    const { name, value } = e.target
    setTransferData({ ...transferData, [name]: value })
  }

  // Transfer money function
  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
          senderEmail: email,
          receiverIdentifier: transferData.receiverIdentifier,
          amount: parseFloat(transferData.amount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Transfer successful!');
        setBalance(data.transaction.senderNewBalance);
        setTransferData({ receiverIdentifier: '', amount: '' });
      } else {
        setError(data.message || 'Transfer failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Transfer error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Current Balance: ${balance.toFixed(2)}</h2>
        <button onClick={fetchBalance}>Refresh Balance</button>
      </div>
      
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <form onSubmit={handleTransfer}>
        <label htmlFor="email">Email or Phone number</label>
        <input
          type="text"
          onChange={handleChange}
          name="receiverIdentifier"
          value={transferData.receiverIdentifier}
        />
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          onChange={handleChange}
          name="amount"
          value={transferData.amount}
        />
        <button disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  )
}

export default TransferMoney