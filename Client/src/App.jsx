import { Routes, Route, useLocation } from "react-router-dom";
import 'keen-slider/keen-slider.min.css';
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/dashboard/Wallet"
import TransferMoney from "./pages/dashboard/TransferMoney"
import Notifications from "./pages/dashboard/Notifications"
import Transaction from "./pages/dashboard/Transactions"
import Card from "./pages/dashboard/Card"
import ProfileUpdate from "./pages/dashboard/Profile"
import { useNotifications } from "./contexts/NotificationContext";
import { Toaster } from "@/components/ui/sonner"
import { AnimatePresence, motion } from 'framer-motion';



function App() {

  const location = useLocation();
  return (
    <>
    <AnimatePresence  mode='wait'>
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
        <Home/>
        </motion.div>
      }/>
      <Route path="/login" element={
       <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
        <Login/>
        </motion.div>
      }/>
      <Route path="/register" element={
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
        <Register/>
        </motion.div>
      }/>
      <Route path="/wallet" element={<Dashboard/>}/>
      <Route path="/transfer" element={<TransferMoney/>}/>
      <Route path="/transactions" element={<Transaction />}/>
      <Route path="/profile" element={<ProfileUpdate />}/>
      <Route path="/notification" element={<NotificationsPage/>}/>
      <Route path="/card" element={<Card/>}/>
    </Routes>
    </AnimatePresence>
    <Toaster />
    </>
  )
}

// Wrapper component to pass props to Notifications
const NotificationsPage = () => {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();
  
  return (
    <Notifications 
      notifications={notifications}
      markAllAsRead={markAllAsRead}
      markAsRead={markAsRead}
    />
  );
};

export default App




