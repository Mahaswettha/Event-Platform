import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">
      <h3>Mini Event Platform</h3>
      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/create">Create Event</Link>
      </div>
    </div>
  );
};

export default Navbar;
