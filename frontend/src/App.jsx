import { useState } from 'react';
import { BrowserRouter as Router,Routes,  Route } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import TradingConsole from './Pages/TradingConsole';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tradingConsole" element={<TradingConsole />} />
      <Route path="/" element={<Login />} />
    </Routes>
  </Router>


  );
}

export default App;
