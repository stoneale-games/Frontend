import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Brightness7Icon className="text-secondary-950" />
      ) : (
        <Brightness4Icon className="text-accent-950" />
      )}
    </button>
  );
};

export default ThemeToggle;
