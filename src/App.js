// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminInterface from "./components/AdminInterface";
import Home from "./components/Home";
import HomePage from "./components/HomePage";
// import './App.css'; // Import the CSS file


function App() {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/poster" element={<HomePage />} />
          <Route path="/admin" element={<AdminInterface />} />
        </Routes>
      </div>
  );
}

export default App;
