import {
	BarChart2,
	Dumbbell,
	Activity,
	Brain,
	FileText,
	User,
	BookOpen,
	ClipboardList,
	ChevronDown,
	Library,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import lightLogo from "../../assets/images/nv-logo-light.png";
import darkLogo from "../../assets/images/nv-logo-dark.png";
import logoCollapsed from "../../assets/images/nv-logo-collapsed.png";

interface SidebarProps {
	showSidebar: boolean;
	setShowSidebar: (show: boolean) => void;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	themeMode?: "light" | "dark" | "system"; // Add theme mode prop
}

const Sidebar = ({
	showSidebar,
	activeTab,
	setActiveTab,
	themeMode = "light",
}: SidebarProps) => {
	const [courseMenuOpen, setCourseMenuOpen] = useState(false);
	const [currentLogo, setCurrentLogo] = useState(lightLogo);

	// Update logo based on theme
	useEffect(() => {
		if (themeMode === "dark") {
			setCurrentLogo(darkLogo);
		} else if (themeMode === "light") {
			setCurrentLogo(lightLogo);
		} else if (themeMode === "system") {
			// Check system preference
			const isDarkMode = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches;
			setCurrentLogo(isDarkMode ? darkLogo : lightLogo);
		}
	}, [themeMode]);

	// Listen for system theme changes when in system mode
	useEffect(() => {
		if (themeMode === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleChange = (e: MediaQueryListEvent) => {
				setCurrentLogo(e.matches ? darkLogo : lightLogo);
			};

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, [themeMode]);

	return (
		<div
			className={`${showSidebar ? "w-64" : "w-20"} bg-white dark:bg-gray-800 h-screen shadow-md fixed transition-all duration-300 z-10`}
		>
			<div className="p-4 flex justify-center items-center">
				{showSidebar ? (
					<div className="w-full h-12 flex-shrink-0">
						<img
							src={currentLogo}
							alt="NeuroVibes Logo"
							className="w-full h-full object-contain"
						/>
					</div>
				) : (
					<div className="w-10 h-10 mx-auto">
						<img
							src={logoCollapsed}
							alt="NeuroVibes Logo"
							className="w-full h-full object-contain"
						/>
					</div>
				)}
			</div>
			<nav className="mt-4">
				<div
					className={`px-4 py-2 ${activeTab === "dashboard" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
					onClick={() => setActiveTab("dashboard")}
					onKeyDown={(e) => e.key === "Enter" && setActiveTab("dashboard")}
				>
					<BarChart2 className="h-5 w-5" />
					{showSidebar && <span className="ml-3 text-sm">Dashboard</span>}
				</div>
				<div className="relative">
					<div
						className={`px-4 py-2 mt-1 ${
							activeTab === "course"
								? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
								: "text-gray-600 dark:text-gray-300"
						} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center justify-between`}
						onClick={() => showSidebar && setCourseMenuOpen(!courseMenuOpen)}
						onKeyDown={(e) =>
							e.key === "Enter" &&
							showSidebar &&
							setCourseMenuOpen(!courseMenuOpen)
						}
					>
						<div className="flex items-center">
							<BookOpen className="h-5 w-5" />
							{showSidebar && <span className="ml-3 text-sm">Course</span>}
						</div>
						{showSidebar && (
							<ChevronDown
								className={`h-4 w-4 transition-transform ${courseMenuOpen ? "transform rotate-180" : ""}`}
							/>
						)}
					</div>

					{/* Submenu */}
					{showSidebar && courseMenuOpen && (
						<div className="ml-6 mt-1 relative">
							{/* Vertical line */}
							<div className="absolute left-2 top-0 bottom-0 w-[1px] bg-gray-200 dark:bg-gray-700" />

							<div
								className={`px-4 py-2 ${
									activeTab === "courses"
										? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
										: "text-gray-600 dark:text-gray-300"
								} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mr-2 ml-6 flex items-center relative`}
								onClick={() => setActiveTab("courses")}
								onKeyDown={(e) => e.key === "Enter" && setActiveTab("courses")}
							>
								<Library className="h-5 w-5" />
								<span className="ml-3 text-sm">Courses</span>
							</div>

							<div
								className={`px-4 py-2 ${
									activeTab === "assessmentRuns"
										? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
										: "text-gray-600 dark:text-gray-300"
								} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mr-2 ml-6 flex items-center relative`}
								onClick={() => setActiveTab("assessmentRuns")}
								onKeyDown={(e) =>
									e.key === "Enter" && setActiveTab("assessmentRuns")
								}
							>
								<ClipboardList className="h-5 w-5" />
								<span className="ml-3 text-sm">Assessment Runs</span>
							</div>
						</div>
					)}
				</div>
				<div
					className={`px-4 py-2 mt-1 ${activeTab === "physical" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
					onClick={() => setActiveTab("physical")}
					onKeyDown={(e) => e.key === "Enter" && setActiveTab("physical")}
				>
					<Dumbbell className="h-5 w-5" />
					{showSidebar && <span className="ml-3 text-sm">Physical</span>}
				</div>
				<div
					className={`px-4 py-2 mt-1 ${activeTab === "psychological" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
					onClick={() => setActiveTab("psychological")}
					onKeyDown={(e) => e.key === "Enter" && setActiveTab("psychological")}
				>
					<Activity className="h-5 w-5" />
					{showSidebar && <span className="ml-3 text-sm">Psychological</span>}
				</div>
				<div
					className={`px-4 py-2 mt-1 ${activeTab === "cognitive" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
					onClick={() => setActiveTab("cognitive")}
					onKeyDown={(e) => e.key === "Enter" && setActiveTab("cognitive")}
				>
					<Brain className="h-5 w-5" />
					{showSidebar && <span className="ml-3 text-sm">Cognitive</span>}
				</div>
				<div
					className={`px-4 py-2 mt-1 ${activeTab === "reports" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
					onClick={() => setActiveTab("reports")}
					onKeyDown={(e) => e.key === "Enter" && setActiveTab("reports")}
				>
					<FileText className="h-5 w-5" />
					{showSidebar && <span className="ml-3 text-sm">Reports</span>}
				</div>
				<div
					className={`px-4 py-2 mt-1 ${activeTab === "profile" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
					onClick={() => setActiveTab("profile")}
					onKeyDown={(e) => e.key === "Enter" && setActiveTab("profile")}
				>
					<User className="h-5 w-5" />
					{showSidebar && <span className="ml-3 text-sm">Profile</span>}
				</div>
			</nav>
			<div className="absolute bottom-4 w-full px-4">
				{/* User Profile Dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className={`w-full flex items-center ${
								showSidebar ? "px-2 py-3" : "justify-center p-2" // Added more padding when collapsed
							} bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600`}
						>
							<Avatar className="h-8 w-8">
								<AvatarImage src="" alt="User" />
								<AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-500 dark:text-teal-300">
									JD
								</AvatarFallback>
							</Avatar>
							{showSidebar && (
								<div className="ml-3 text-left">
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
										John Doe
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										Trainee
									</p>
								</div>
							)}
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => setActiveTab("profile")}>
							My Profile
						</DropdownMenuItem>
						<DropdownMenuItem>Sign out</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default Sidebar;
