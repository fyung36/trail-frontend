"use client";
import { createContext, useState, useEffect, useMemo } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

export const ThemeContext = createContext<any>({});

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const switchDark = () => {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
  };
  
  const switchLight = () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
  };

  const antdConfig = useMemo(() => ({
    algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      colorPrimary: "#1354d3",
      borderRadius: 8,
    },
  }), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, switchDark, switchLight }}>
      <ConfigProvider theme={antdConfig}>
        <div className={`${theme} anim`} style={{ minHeight: '100vh' }}>
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
