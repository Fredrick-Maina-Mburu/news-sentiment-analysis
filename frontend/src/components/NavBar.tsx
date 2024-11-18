import React from "react";
import { NavLink }  from 'react-router-dom'
const Navbar= () => {
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center mx-auto">
      <h1 className="text-xl font-bold">News Sentiment</h1>
      <ul className="flex space-x-4">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
        <li><a href="/login" className="hover:underline">Login</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
