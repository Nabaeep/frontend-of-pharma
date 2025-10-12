import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Pages/signIn";
import HomePage from "./Pages/Home";
import Navbar from "./Components/Navbar";
import AddSupplier from "./Pages/AddSupplier";
import AddMed from "./Pages/AddMed";

function App() {
  // ✅ Initialize from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-supplier" element={<AddSupplier />}

       
        />
         <Route path="/add-medicine" element={<AddMed />} />
      </Routes>
    </Router>
  );
}

export default App;
