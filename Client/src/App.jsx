import {Routes, Route, useLocation} from "react-router-dom";
import 'keen-slider/keen-slider.min.css';
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/dashboard/Wallet"
import TransferMoney from "./pages/dashboard/TransferMoney"
import Notifications from "./pages/dashboard/Notifications"
import { useNotifications } from "./contexts/NotificationContext";



function App() {

  const location = useLocation();
  return (
    <>
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/wallet" element={<Dashboard/>}/>
      <Route path="/transfer" element={<TransferMoney/>}/>
      <Route path="/notification" element={<NotificationsPage/>}/>
    </Routes>
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




