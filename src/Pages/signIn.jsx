import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn({ setIsLoggedIn }) {
  const navigate = useNavigate();

  // ✅ Initialize based on token
  const [isSignIn, setIsSignIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------- Sign In ----------------
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Signin failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  // ---------------- Sign Up ----------------
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Signup successful!");
      setName("");
      setEmail("");
      setPassword("");
      setIsSignIn(true); // switch to Sign In
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-full max-w-5xl h-[600px] shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* ---------- Left Panel ---------- */}
        <div
          className={`absolute inset-0 md:static md:w-1/2 h-full flex flex-col justify-center items-center p-10 transition-all duration-700 ease-in-out ${
            isSignIn ? "translate-x-full md:translate-x-0 bg-white text-gray-900" : "bg-gray-900 text-white"
          }`}
        >
          {!isSignIn ? (
            <>
              <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-center mb-6 max-w-xs">
                To keep connected with us please login with your personal info
              </p>
              <button
                onClick={() => setIsSignIn(true)}
                className="border border-white rounded-full px-8 py-2 text-lg hover:bg-white hover:text-gray-900 transition"
              >
                SIGN IN
              </button>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6">Sign In</h1>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-72 md:w-80 border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-72 md:w-80 border rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                onClick={handleSignIn}
                className="bg-blue-900 text-white px-10 py-2 rounded-full text-lg hover:bg-blue-800 transition"
              >
                SIGN IN
              </button>
              <p
                onClick={() => setIsSignIn(false)}
                className="mt-4 text-sm cursor-pointer hover:underline"
              >
                Don’t have an account? Sign Up
              </p>
            </>
          )}
        </div>

        {/* ---------- Right Panel ---------- */}
        <div
          className={`absolute inset-0 md:static md:w-1/2 h-full flex flex-col justify-center items-center p-10 transition-all duration-700 ease-in-out ${
            isSignIn ? "bg-gray-900 text-white" : "translate-x-full md:translate-x-0 bg-white text-gray-900"
          }`}
        >
          {!isSignIn ? (
            <>
              <h1 className="text-3xl font-bold text-blue-900 mb-6">Create Account</h1>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-72 md:w-80 border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-72 md:w-80 border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-72 md:w-80 border rounded px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                onClick={handleSignUp}
                className="bg-blue-900 text-white px-10 py-2 rounded-full text-lg hover:bg-blue-800 transition"
              >
                SIGN UP
              </button>
              <p
                onClick={() => setIsSignIn(true)}
                className="mt-4 text-sm cursor-pointer hover:underline"
              >
                Already have an account? Sign In
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-4">Hello, Friend!</h1>
              <p className="text-center mb-6 max-w-xs">
                Enter your details and start your journey with us
              </p>
              <button
                onClick={() => setIsSignIn(false)}
                className="border border-white rounded-full px-8 py-2 text-lg hover:bg-white hover:text-gray-900 transition"
              >
                SIGN UP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
