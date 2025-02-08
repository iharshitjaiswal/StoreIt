"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Get stored theme from localStorage or fallback to system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      document.documentElement.classList.add(storedTheme);
    } else {
      // Use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.add(prefersDark ? "dark" : "light");
    }
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Remove previous class and add new one
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
  };

  return (
    <div
      className="relative w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer"
      onClick={toggleTheme}
    >
      {/* Slider */}
      <motion.div
        className="absolute w-6 h-6 bg-white dark:bg-slate-500  rounded-full shadow-md flex items-center justify-center"
        initial={{ x: theme === "light" ? 0 : 28 }}
        animate={{ x: theme === "light" ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {theme === "light" ? (
          <Sun size={20} className="text-yellow-500" />
        ) : (
          <Moon size={20} className="text-orange" />
        )}
      </motion.div>
    </div>
  );
};

export default DarkModeToggle;
