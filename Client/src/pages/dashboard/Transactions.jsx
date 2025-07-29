import { useState, useMemo } from 'react';
import { Send, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import useUserStore from "@/stores/userStore";
import { useTransactions } from '@/contexts/TransactionContext';

const Transaction = () => {
  const { transactions } = useTransactions();
  const [showAll, setShowAll] = useState(false);
  const [filterType, setFilterType] = useState('all'); // 'all', 'credit', 'debit'
  const user = useUserStore((state) => state.user);



  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    
    const day = date.getDate();
    const ordinal = day + (day > 3 && day < 21 ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th');
    
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const year = date.toLocaleDateString('en-GB', { year: 'numeric' });
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return `${ordinal} ${month}, ${year} | ${time}`;
  };

  // Process and filter transactions
  const processedTransactions = useMemo(() => {
    if (!transactions || !transactions.length || !user?.user?.id) return [];

    const processed = transactions.map(transaction => {
      const isCredit = String(transaction.receiver_id) === String(user.user.id);
      const name = isCredit ? transaction.sender_name : transaction.receiver_name;
      
      return {
        ...transaction,
        isCredit,
        name,
        formattedDate: formatDateTime(transaction.created_at),
        amount: Number(transaction.amount)
      };
    });

    // Filter by type
    if (filterType === 'credit') {
      return processed.filter(t => t.isCredit);
    } else if (filterType === 'debit') {
      return processed.filter(t => !t.isCredit);
    }
    
    return processed;
  }, [transactions, user?.user?.id, filterType]);

  // Get transactions to display
  const displayTransactions = showAll 
    ? processedTransactions 
    : processedTransactions.slice(0, 10);

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          text: 'Successful',
          color: 'text-green-600'
        };
      case 'failed':
        return {
          icon: XCircle,
          text: 'Failed',
          color: 'text-red-600'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          color: 'text-yellow-600'
        };
      default:
        return {
          icon: Clock,
          text: 'Unknown',
          color: 'text-gray-600'
        };
    }
  };

  // Loading state
  if (!user?.user?.id) {
    return (
      <>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading user data...</p>
          </div>
        </div>
        <BottomNavigation />
      </>
    );
  }

  return (
    <>
      <div className="font-voyage bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Transaction History</h3>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {showAll ? "Show Less" : "View All"}
            </button>
          </div>


          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'credit', label: 'Received' },
              { key: 'debit', label: 'Sent' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === filter.key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>


        <div className="p-6">
          {displayTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h4>
              <p className="text-gray-500">
                {filterType === 'all' 
                  ? "You haven't made any transactions yet."
                  : `No ${filterType === 'credit' ? 'received' : 'sent'} transactions found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayTransactions.map((transaction) => {
                const statusDisplay = getStatusDisplay(transaction.status);
                const StatusIcon = statusDisplay.icon;

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {/* Left Side - Icon and Details */}
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.isCredit ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {transaction.isCredit ? (
                          <Send className="w-6 h-6 text-green-600 rotate-90" />
                        ) : (
                          <Send className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.name || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.formattedDate}
                        </p>
                        <div className="flex items-center mt-1">
                          <StatusIcon className={`w-4 h-4 mr-1 ${statusDisplay.color}`} />
                          <span className={`text-xs font-medium ${statusDisplay.color}`}>
                            {statusDisplay.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Amount */}
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        transaction.isCredit ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.isCredit ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {transaction.isCredit ? 'Received' : 'Sent'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show more indicator */}
          {!showAll && processedTransactions.length > 10 && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Showing 10 of {processedTransactions.length} transactions
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </>
  );
};

export default Transaction;