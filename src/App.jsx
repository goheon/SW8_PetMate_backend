import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Notfound from './pages/Notfound';

import './reset.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
