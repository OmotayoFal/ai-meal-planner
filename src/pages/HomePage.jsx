import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [form, setForm] = useState({
    budget: "",
    allergies: "",
    preferences: "",
    cookingLevel: "beginner",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "Friend";
    setUserName(storedName);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      const res = await axios.post("http://localhost:5000/api/mealplan", form);
      localStorage.setItem("mealResults", JSON.stringify(res.data));
      navigate("/results");
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
      alert("Failed to generate meal plan");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Hello, {userName}! 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Let’s personalize your meal plan. Fill out the details below.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="Weekly Budget (£)"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
            required
          />

          <input
            type="text"
            name="allergies"
            value={form.allergies}
            onChange={handleChange}
            placeholder="Allergies (comma-separated)"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
          />

          <input
            type="text"
            name="preferences"
            value={form.preferences}
            onChange={handleChange}
            placeholder="Preferences (e.g. no fish, like chicken)"
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition"
          />

          <select
            name="cookingLevel"
            value={form.cookingLevel}
            onChange={handleChange}
            className="w-full p-4 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition bg-white"
          >
            <option value="beginner">Beginner 👩‍🍳</option>
            <option value="intermediate">Intermediate 🍳</option>
            <option value="advanced">Advanced 👨‍🍳</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-medium shadow-md text-white transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Generating..." : "Generate Meal Plan"}
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-600 mt-4">Please wait while your meal plan is generated...</p>
        )}
      </div>
    </div>
  );
}
