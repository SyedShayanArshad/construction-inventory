"use client";

import React, { useState, useEffect } from "react";
import { CiLight, CiDark } from "react-icons/ci";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-15 h-7 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-colors duration-500"
    >
      <div
        className={`w-6 h-6 bg-white dark:bg-black rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center
        ${isDark ? "translate-x-7" : "translate-x-0"}`}
      >
        {isDark ? (
          <CiLight className="text-white h-5 w-5" />
        ) : (
          <CiDark className="text-black h-5 w-5" />
        )}
      </div>
    </button>
  );
}
