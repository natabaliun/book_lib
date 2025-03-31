import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UserPage from './components/User/UserPage';
import UserBooks from './components/User/UserBooks';
import AdminPage from './components/Admin/AdminPage';
import AdminUsers from './components/Admin/AdminUsers';
import Navigation from './components/Navigation';

const App = () => {
  return (
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserPage />}>
            <Route path="books" element={<UserBooks />} />
          </Route>
          <Route path="/admin" element={<AdminPage />}>
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Router>
  );
};

export default App;