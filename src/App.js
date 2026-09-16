import './App.css';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MyDonations from './pages/MyDonations.jsx';
import AccountStatus from './components/auth/AccountStatus.jsx';
import Login from './components/auth/Login.jsx';
import Signup from './components/auth/Signup.jsx';
import VerifyOtp from './components/auth/VerifyOtp.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import ResetPassword from './components/auth/ResetPassword.jsx';

function App() {
  return (
    <div className="App">
      <header className="site-header">
        <Link to="/" className="site-brand">
          <span className="site-brand-mark" aria-hidden="true">G</span>
          Ghribi Foundation
        </Link>
        <AccountStatus />
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <footer className="site-footer">
        Ghribi Foundation &mdash; giving made simple.
      </footer>
    </div>
  );
}

export default App;
