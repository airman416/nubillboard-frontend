// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminInterface from "./components/AdminInterface";
import Home from "./components/Home";
import BillboardPreview from "./components/BillboardPreview";

function App() {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/poster" element={<BillboardPreview />} />
          <Route path="/admin" element={<AdminInterface />} />
        </Routes>
      </div>
  );
}

export default App;
