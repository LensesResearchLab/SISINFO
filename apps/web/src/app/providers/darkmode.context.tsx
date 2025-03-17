"use client";
import React, { useState, useEffect, createContext, useMemo, useCallback } from 'react';

const state = {
  darkMode: "dark",
  lightMode: "light",
};

export const DarkModeContext = createContext({
  mode: state.lightMode,
  changeTheme: () => {},
});

export default function DarkMode({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [mode, setMode] = useState(state.lightMode);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setMode( saved ??state.lightMode);
    setIsLoaded(true);
  }, []);

  const changeTheme = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === state.lightMode ? state.darkMode : state.lightMode;
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  }, []);

  const contextValue = useMemo(() => ({ mode, changeTheme }), [mode, changeTheme]);

  if (!isLoaded) {
    return null;
  }

  return (
    <DarkModeContext.Provider value={contextValue}>
      <div className={`${mode}`}>
        {children}
      </div>
    </DarkModeContext.Provider>
  );
}