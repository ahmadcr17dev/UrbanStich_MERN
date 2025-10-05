import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import HeroSection from "./components/HeroSection";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Footer from "./components/Footer";
import Services from "./components/Services";
import { Toaster } from "react-hot-toast";
import PopularProducts from "./components/PopularProducts";
import Shop from "./components/Shop";
import SingleProduct from "./components/SingleProduct";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import PageNotFound from "./components/PageNotFound";
import Testimonials from "./components/Testimonials";
import About from "./components/About";

const AppContent = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Listen for register button click from inside Login
  useEffect(() => {
    const openRegister = () => {
      setShowLogin(false);
      setShowRegister(true);
    };
    document.addEventListener("openRegisterModal", openRegister);
    return () => {
      document.removeEventListener("openRegisterModal", openRegister);
    };
  }, []);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setShowLogin(false);
    if (role === "Admin") {
      navigate("/admin");
    } else if (role === "user") {
      navigate("/");
    }
  };

  return (
    <>
      <Navbar
        onLoginClick={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onRegisterClick={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      {/* For Login panel */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onLoginSuccess={handleLoginSuccess} // ✅ Pass role handler to Login
        />
      )}

      {/* For Register Panel */}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
      <HeroSection />
      <PopularProducts />
      <Services />
      <Testimonials />
      <About />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="/shop" element={
            <>
              <Navbar />
              <Shop />
              <Footer />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Navbar />
              <SingleProduct />
              <Footer />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
          } />
          <Route path="/wishlist" element={
            <>
              <Navbar />
              <Wishlist />
              <Footer />
            </>
          } />
          <Route path="/checkout" element={
            <>
              <Navbar />
              <Checkout />
              <Footer />
            </>
          }
          />
          <Route path="/ordersuccess" element={
            <>
              <OrderSuccess />
            </>
          }
          />
          <Route path="*" element={
            <>
              <PageNotFound />
            </>
          } />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
};

export default App;