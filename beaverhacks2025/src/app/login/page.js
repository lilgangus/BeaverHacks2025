"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const loginInputRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (loginInputRef.current) {
      loginInputRef.current.focus();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful");
        
        // Redirect to the home page or dashboard
        window.location.href = "/home"; // Adjust the path as necessary
        return;
      }

      setErrorMessage(data.message || "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred during login");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <p className="mb-4">Login to your account</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 font-medium">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            ref={loginInputRef}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>

      <p className="mt-4">
        Don&apos;t have an account?
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
}
