import {Routes, Route, useLocation} from "react-router-dom";
import 'keen-slider/keen-slider.min.css';
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/dashboard/Wallet"
import TransferMoney from "./pages/dashboard/TransferMoney"


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
    </Routes>

    </>
  )
}

export default App




