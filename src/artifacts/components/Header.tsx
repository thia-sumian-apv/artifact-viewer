import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Monitor, PanelsTopLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
	activeTab: string;
	showSidebar: boolean;
	setShowSidebar: (show: boolean) => void;
	themeMode: "light" | "dark" | "system";
	setThemeMode: (mode: "light" | "dark" | "system") => void;
}

type ThemeMode = "light" | "dark" | "system";

const Header = ({
	activeTab,
	showSidebar,
	setShowSidebar,
	setThemeMode,
}: HeaderProps) => {
	const [mode, setMode] = useState<ThemeMode>(() => {
		// Check localStorage first
		const savedMode = localStorage.getItem("theme") as ThemeMode;
		if (savedMode) {
			return savedMode;
		}
		// If no saved preference, default to system
		return "system";
	});

	const formatTabName = (tab: string) => {
		return tab.charAt(0).toUpperCase() + tab.slice(1);
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
				<div className="flex flex-col space-y-2">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setShowSidebar(!showSidebar)}
								className="p-0 -ml-1 mr-4 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
							>
								<PanelsTopLeft className="h-5 w-5 transform transition-transform" />
							</button>
							<Separator orientation="vertical" />
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
						</div>

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
			</div>
		</header>
	);
};

export default Header;
