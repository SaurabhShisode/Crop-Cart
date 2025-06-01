import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage'; 
import Home from './pages/Home'; 
import CheckoutPage from './pages/CheckoutPage';
import MyOrders from './pages/MyOrders';
import FarmerLogin from './pages/FarmerLoginPage'; 
import FarmerRegister from './pages/FarmerRegisterPage'; 
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/home" element={<Home />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/myorders" element={<MyOrders />} />
      <Route path="/farmer-login" element={<FarmerLogin  />} />
      <Route path="/farmer-register" element={<FarmerRegister  />} />

    </Routes>
  );
}

export default App;
