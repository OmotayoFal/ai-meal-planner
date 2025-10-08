import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ResultsPage from "./pages/results.jsx"; // make sure the file exports ResultsPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/results" element={<ResultsPage />} /> 
        <Route path="*" element={<Navigate to="/homepage" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
