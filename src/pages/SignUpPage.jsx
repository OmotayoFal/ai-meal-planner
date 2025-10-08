import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUpPage() {
  const navigate = useNavigate(); // for redirecting after signup
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      console.log("Signed up user:", res.data);
      localStorage.setItem("token", res.data.token);
      alert("Signup successful!");
      navigate("/home"); // redirect to home/dashboard after signup
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
      alert(err.response?.data?.msg || "Error signing up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Create Account
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
          />

          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            placeholder="Date of Birth"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
