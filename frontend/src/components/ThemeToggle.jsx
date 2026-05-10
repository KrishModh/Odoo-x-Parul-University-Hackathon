import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext.jsx';
import '../styles/components/ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="icon-button theme-toggle" onClick={toggleTheme} type="button" aria-label="Toggle theme">
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  );
}
