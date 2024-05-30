// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ComputeScreen from './components/computeScreen';
import SelectionScreen from './components/selectionScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectionScreen />} />
        <Route path="/compute" element={<ComputeScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
