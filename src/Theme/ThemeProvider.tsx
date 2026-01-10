"use client";
import { createContext, useState, useEffect, useMemo } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

export const ThemeContext = createContext<any>({});

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    setIsMounted(true);
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
      fontFamily: "'Inter', sans-serif",
      colorPrimary: "#1a56db",
      borderRadius: 8,
      colorBgContainer: theme === "dark" ? "#1e293b" : "#ffffff",
      colorBorderSecondary: theme === "dark" ? "#334155" : "#f1f5f9",
      colorTextBase: theme === "dark" ? "#f1f5f9" : "#1e293b",
      colorTextDescription: theme === "dark" ? "#94a3b8" : "#64748b",
    },
    components: {
      Button: {
        borderRadius: 8,
        controlHeight: 40,
        fontWeight: 500,
      },
      Card: {
        borderRadiusLG: 12,
      },
      Table: {
        borderRadius: 12,
      }
    }
  }), [theme]);

  if (!isMounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

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
