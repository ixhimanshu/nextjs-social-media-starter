"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.user._id);
      localStorage.setItem("user", JSON.stringify(data.user));


      console.log(data);
      

      // Login successful
      // You can store token/session here or redirect
      console.log("Login success:", data);
      

      setLoading(false);
      router.push("/"); 
    } catch (err) {
      setError("Something went wrong, try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          BlinkMe Admin Login 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold py-2 px-4 rounded-md transition duration-200`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-indigo-600 font-medium hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
