import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckSquare, Square } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recipes");
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [estimatedTotal, setEstimatedTotal] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("mealResults");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRecipes(parsed.recipes || []);
      setShoppingList(parsed.shoppingList || []);
      setEstimatedTotal(parsed.estimatedTotal || "");
    }

    const storedChecklist = localStorage.getItem("shoppingChecklist");
    if (storedChecklist) {
      setCheckedItems(JSON.parse(storedChecklist));
    }
  }, []);

  // ✅ Save checklist progress to localStorage
  useEffect(() => {
    localStorage.setItem("shoppingChecklist", JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleCheck = (item) => {
    setCheckedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const nextRecipe = () => {
    setCurrentIndex((prev) => (prev + 1) % recipes.length);
  };

  const prevRecipe = () => {
    setCurrentIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Your Weekly Meal Plan 
        </h1>

        {estimatedTotal && (
          <p className="text-gray-700 font-medium mb-4 text-center">
            Estimated total cost: {estimatedTotal} (approx.)
          </p>
        )}

        {/* Tabs */}
        <div className="flex justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("recipes")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "recipes"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            Recipes
          </button>
          <button
            onClick={() => setActiveTab("shoppingList")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "shoppingList"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            Shopping Checklist
          </button>
        </div>

        {/* === Recipes Carousel === */}
        {activeTab === "recipes" && (
          <div className="relative flex flex-col items-center">
            {recipes.length === 0 ? (
              <p className="text-gray-600 text-center">No recipes found.</p>
            ) : (
              <>
                <div className="flex items-center justify-center mb-4 space-x-4">
                  <button
                    onClick={prevRecipe}
                    className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 transition"
                  >
                    <ChevronLeft className="text-indigo-600 w-6 h-6" />
                  </button>

                  <div className="w-[90%] max-w-lg overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.4 }}
                        className="bg-gray-50 p-6 rounded-2xl shadow-sm"
                      >
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                          {recipes[currentIndex].name}
                        </h2>

                        <h3 className="font-medium text-gray-700 mb-2">
                          Ingredients
                        </h3>
                        <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
                          {recipes[currentIndex].ingredients?.map(
                            (item, i) => (
                              <li key={i}>{item}</li>
                            )
                          )}
                        </ul>

                        <h3 className="font-medium text-gray-700 mb-2">
                          Method
                        </h3>
                        <ol className="list-decimal list-inside text-gray-600 space-y-1">
                          {recipes[currentIndex].method?.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={nextRecipe}
                    className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 transition"
                  >
                    <ChevronRight className="text-indigo-600 w-6 h-6" />
                  </button>
                </div>

                {/* Dots */}
                <div className="flex justify-center space-x-2 mt-4">
                  {recipes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-3 h-3 rounded-full transition ${
                        currentIndex === idx
                          ? "bg-indigo-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    ></button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* === Interactive Shopping Checklist === */}
        {activeTab === "shoppingList" && (
          <div>
            {shoppingList.length === 0 ? (
              <p className="text-gray-600 text-center">
                No shopping list available.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                {shoppingList.map((item, idx) => {
                  const isChecked = checkedItems[item] || false;
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleCheck(item)}
                      className={`flex items-center justify-between w-full bg-gray-100 p-3 rounded-xl shadow-sm transition ${
                        isChecked
                          ? "bg-green-100 border-green-400 text-green-700"
                          : "hover:bg-indigo-50"
                      }`}
                    >
                      <span
                        className={`text-left ${
                          isChecked ? "line-through opacity-70" : ""
                        }`}
                      >
                        {item}
                      </span>
                      {isChecked ? (
                        <CheckSquare className="text-green-600 w-5 h-5" />
                      ) : (
                        <Square className="text-gray-400 w-5 h-5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/homepage")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium shadow-md"
          >
            Generate Another Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
}
