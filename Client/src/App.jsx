import {Routes, Route, useLocation} from "react-router-dom";
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Wallet"
import Wallet from "./components/Wallet"
import TransferMoney from "./components/TransferMoney"

function App() {



  const location = useLocation();
  return (
    <>
    <Routes location={location} key={location.pathname}>
      <Route 
      path="/" 
      element={<Login/>}
      />
      <Route 
      path="/register" 
      element={<Register/>}
      />
      <Route 
      path="/wallet" 
      element={<Wallet/>}
      />
      <Route 
      path="/transfer" 
      element={<TransferMoney/>}
      />
    </Routes>

    </>
  )
}

export default App




