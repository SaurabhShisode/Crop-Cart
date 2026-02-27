import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/Home';
import CheckoutPage from './pages/CheckoutPage';
import MyOrders from './pages/MyOrders';
import FarmerLogin from './pages/FarmerLoginPage';
import FarmerRegister from './pages/FarmerRegisterPage';
import FarmerDashboard from './pages/FarmerDashboard';
import MyAccount from './pages/MyAccount';
import ScrollToTop from './components/ScrollToTop';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AnimatedRoute({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedRoute><LandingPage /></AnimatedRoute>} />
          <Route path="/login" element={<AnimatedRoute><Login /></AnimatedRoute>} />
          <Route path="/register" element={<AnimatedRoute><Register /></AnimatedRoute>} />
          <Route path="/home" element={<AnimatedRoute><Home /></AnimatedRoute>} />
          <Route path="/checkout" element={<AnimatedRoute><CheckoutPage /></AnimatedRoute>} />
          <Route path="/myorders" element={<AnimatedRoute><MyOrders /></AnimatedRoute>} />
          <Route path="/farmer-login" element={<AnimatedRoute><FarmerLogin /></AnimatedRoute>} />
          <Route path="/farmer-register" element={<AnimatedRoute><FarmerRegister /></AnimatedRoute>} />
          <Route path="/farmer-dashboard" element={<AnimatedRoute><FarmerDashboard /></AnimatedRoute>} />
          <Route path="/my-account" element={<AnimatedRoute><MyAccount /></AnimatedRoute>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
