import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // import useNavigate
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate(); // initialize navigate
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      console.log("Logged in user:", res.data);

      // Save token and username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);

      alert("Login successful!");

      // Redirect to homepage
      navigate("/homepage"); // <-- redirect after login
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Welcome Back
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
            required
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            Log In
          </button>
        </form>

        {/* Signup link */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
