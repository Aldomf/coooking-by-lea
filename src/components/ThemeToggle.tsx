import { useTheme } from "@/context/ThemeContext";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 rounded dark:text-white">
      {theme === 'light' ? <MdOutlineDarkMode size={24}/> : <MdOutlineLightMode size={24}/>}
    </button>
  );
};

export default ThemeToggle;
