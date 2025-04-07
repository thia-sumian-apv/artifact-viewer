import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  activeTab: string;
  themeMode: "light" | "dark" | "system";
  setThemeMode: (mode: "light" | "dark" | "system") => void;
}

type ThemeMode = "light" | "dark" | "system";

const Header = ({ activeTab, themeMode, setThemeMode }: HeaderProps) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // First prioritize the prop value from parent
    if (themeMode) {
      return themeMode;
    }
    // Then check localStorage
    const savedMode = localStorage.getItem("theme") as ThemeMode;
    if (savedMode) {
      return savedMode;
    }
    // If nothing else, default to light (matching parent's default)
    return "light";
  });

  const formatTabName = (tab: string) => {
    // First split by camelCase
    const words = tab
      .replace(/([A-Z])/g, " $1")
      // Handle special case where the first character might create an extra space
      .replace(/^./, (str) => str.toUpperCase())
      // Trim any extra spaces that might have been created
      .trim();

    return words;
  };

  useEffect(() => {
    const root = window.document.documentElement;

    if (mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.toggle("dark", systemTheme === "dark");

      // Add listener for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle("dark", e.matches);
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }

    root.classList.toggle("dark", mode === "dark");
    localStorage.setItem("theme", mode);
  }, [mode]);

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    setThemeMode(newMode);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatTabName(activeTab)}
                  </h1>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Group */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex items-center">
              <button
                type="button"
                className={`p-2 rounded-md transition-colors ${
                  mode === "light"
                    ? "bg-teal-500 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                onClick={() => handleModeChange("light")}
                aria-label="Light mode"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={`p-2 rounded-md transition-colors ${
                  mode === "dark"
                    ? "bg-teal-500 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                onClick={() => handleModeChange("dark")}
                aria-label="Dark mode"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={`p-2 rounded-md transition-colors ${
                  mode === "system"
                    ? "bg-teal-500 text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                onClick={() => handleModeChange("system")}
                aria-label="System theme"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
