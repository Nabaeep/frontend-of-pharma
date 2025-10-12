import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, onSignOut }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoggedIn) {
      onSignOut();
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-full h-20 bg-gray-950 flex justify-between items-center px-8 text-white">
      <h1 className="text-2xl font-bold">PharmaChain</h1>
      <div className="flex gap-6 font-semibold">
        
        <a href="/home">Home</a>
          <a href="/add-supplier">Add Supplier</a>
            <a href="/add-medicine">Add Medicine</a>
        <button onClick={handleClick}>
          {isLoggedIn ? "Sign Out" : "Sign In"}
        </button>
      
      </div>
          </div>
  );
};

export default Navbar;
