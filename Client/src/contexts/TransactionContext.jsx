import React, { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};


export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);

     // Load transactions from localStorage on mount
     useEffect(() => {
       const savedTransactions = localStorage.getItem('transactions');
       if (savedTransactions) {
         const parsedTransactions = JSON.parse(savedTransactions);
         setTransactions(parsedTransactions);
       }
     }, []);
   
     // Save transactions to localStorage whenever they change
   useEffect(() => {
    if (transactions.length > 0) { // Only save if there are transactions
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);                     

  // Method to update transactions from API calls
  const updateTransactions = (newTransactions) => {
    setTransactions(newTransactions);
  };
   
   return (
    <TransactionContext.Provider value={{
        transactions,
        setTransactions: updateTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};