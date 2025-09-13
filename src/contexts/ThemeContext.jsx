import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light'); // This tracks the user's preference
  const [theme, setTheme] = useState('light'); // This tracks the actual applied theme

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedThemeMode = localStorage.getItem('theme') || 'light';
    setThemeMode(savedThemeMode);
    applyThemeMode(savedThemeMode);
  }, []);

  useEffect(() => {
    // Listen for system theme changes when in system mode
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e) => {
        const systemTheme = e.matches ? 'dark' : 'light';
        setTheme(systemTheme);
        applyTheme(systemTheme);
      };

      // Set initial system theme
      handleSystemThemeChange(mediaQuery);
      
      // Listen for changes
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      // Cleanup
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [themeMode]);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const applyThemeMode = (newThemeMode) => {
    if (newThemeMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      setTheme(systemTheme);
      applyTheme(systemTheme);
    } else {
      setTheme(newThemeMode);
      applyTheme(newThemeMode);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const setThemeModeHandler = (newThemeMode) => {
    setThemeMode(newThemeMode);
    localStorage.setItem('theme', newThemeMode);
    applyThemeMode(newThemeMode);
  };

  const value = {
    theme, // actual applied theme ('light' or 'dark')
    themeMode, // user preference ('light', 'dark', or 'system')
    toggleTheme,
    setThemeMode: setThemeModeHandler,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};