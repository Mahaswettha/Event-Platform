import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuth(token && user);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={isAuth ? <Navigate to="/" /> : <Register setIsAuth={setIsAuth} />} />
        <Route path="/" element={isAuth ? <Dashboard setIsAuth={setIsAuth} /> : <Navigate to="/login" />} />
        <Route path="/create" element={isAuth ? <CreateEvent /> : <Navigate to="/login" />} />
        <Route path="/edit/:id" element={isAuth ? <EditEvent /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isAuth ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
