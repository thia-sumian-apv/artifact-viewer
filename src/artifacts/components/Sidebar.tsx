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
	Building2,
	Users,
	UserCog,
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
import type { UserRole } from "..";

interface SidebarProps {
	showSidebar: boolean;
	setShowSidebar: (show: boolean) => void;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	userRole?: UserRole;
	themeMode?: "light" | "dark" | "system";
}

const Sidebar = ({
	showSidebar,
	activeTab,
	setActiveTab,
	themeMode = "light",
	userRole = "trainee",
}: SidebarProps) => {
	const [courseMenuOpen, setCourseMenuOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
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

	// Define which tabs are visible for each role
	const rolePermissions = {
		superAdmin: [
			"dashboard",
			"companies",
			"course",
			"physical",
			"psychological",
			"cognitive",
			"reports",
			"profile",
			"users",
		],
		companyAdmin: [
			"dashboard",
			"course",
			"physical",
			"psychological",
			"cognitive",
			"reports",
			"profile",
			"users",
		],
		courseCommander: ["dashboard", "course", "reports", "profile"],
		courseTrainer: ["dashboard", "course", "reports", "profile"],
		trainee: ["dashboard", "physical", "psychological", "cognitive", "profile"],
	};

	// Get current role's visible tabs
	const visibleTabs = rolePermissions[userRole] || rolePermissions.trainee;

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
				{visibleTabs.includes("dashboard") && (
					<div
						className={`px-4 py-2 ${activeTab === "dashboard" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("dashboard")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("dashboard")}
					>
						<BarChart2 className="h-5 w-5" />
						{showSidebar && <span className="ml-3 text-sm">Dashboard</span>}
					</div>
				)}

				{visibleTabs.includes("companies") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "companies" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("companies")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("companies")}
					>
						<Building2 className="h-5 w-5" />
						{showSidebar && <span className="ml-3 text-sm">Companies</span>}
					</div>
				)}

				{visibleTabs.includes("users") && (
					<div className="relative">
						<div
							className={`px-4 py-2 mt-1 ${"text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center justify-between`}
							onClick={() => showSidebar && setUserMenuOpen(!userMenuOpen)}
							onKeyDown={(e) =>
								e.key === "Enter" &&
								showSidebar &&
								setUserMenuOpen(!userMenuOpen)
							}
						>
							<div className="flex items-center">
								<UserCog className="h-5 w-5" />
								{showSidebar && (
									<span className="ml-3 text-sm">User Management</span>
								)}
							</div>
							{showSidebar && (
								<ChevronDown
									className={`h-4 w-4 transition-transform ${userMenuOpen ? "transform rotate-180" : ""}`}
								/>
							)}
						</div>

						{/* Submenu */}
						{showSidebar && userMenuOpen && (
							<div className="ml-6 mt-1 relative">
								{/* Vertical line */}
								<div className="absolute left-2 top-0 bottom-0 w-[1px] bg-gray-200 dark:bg-gray-700" />

								<div
									className={`px-4 py-2 ${
										activeTab === "users"
											? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
											: "text-gray-600 dark:text-gray-300"
									} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mr-2 ml-6 flex items-center relative`}
									onClick={() => setActiveTab("users")}
									onKeyDown={(e) => e.key === "Enter" && setActiveTab("users")}
								>
									<Users className="h-5 w-5" />
									<span className="ml-3 text-sm">Users</span>
								</div>

								<div
									className={`px-4 py-2 ${
										activeTab === "cohorts"
											? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
											: "text-gray-600 dark:text-gray-300"
									} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mr-2 ml-6 flex items-center relative`}
									onClick={() => setActiveTab("cohorts")}
									onKeyDown={(e) =>
										e.key === "Enter" && setActiveTab("cohorts")
									}
								>
									<ClipboardList className="h-5 w-5" />
									<span className="ml-3 text-sm">Cohorts</span>
								</div>
							</div>
						)}
					</div>
				)}

				{visibleTabs.includes("course") && (
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
								{showSidebar && (
									<span className="ml-3 text-sm">Course Management</span>
								)}
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
									onKeyDown={(e) =>
										e.key === "Enter" && setActiveTab("courses")
									}
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
				)}

				{visibleTabs.includes("physical") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "physical" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("physical")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("physical")}
					>
						<Dumbbell className="h-5 w-5" />
						{showSidebar && <span className="ml-3 text-sm">Physical</span>}
					</div>
				)}

				{visibleTabs.includes("psychological") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "psychological" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("psychological")}
						onKeyDown={(e) =>
							e.key === "Enter" && setActiveTab("psychological")
						}
					>
						<Activity className="h-5 w-5" />
						{showSidebar && <span className="ml-3 text-sm">Psychological</span>}
					</div>
				)}

				{visibleTabs.includes("cognitive") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "cognitive" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("cognitive")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("cognitive")}
					>
						<Brain className="h-5 w-5" />
						{showSidebar && <span className="ml-3 text-sm">Cognitive</span>}
					</div>
				)}

				{visibleTabs.includes("reports") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "reports" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("reports")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("reports")}
					>
						<FileText className="h-5 w-5" />
						{showSidebar && <span className="ml-3 text-sm">Reports</span>}
					</div>
				)}

				{visibleTabs.includes("profile") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "profile" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("profile")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("profile")}
					>
						<User className="h-5 w-5" />
						{showSidebar && <span className="ml-3 text-sm">Profile</span>}
					</div>
				)}
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
										{userRole === "superAdmin"
											? "Super Admin"
											: userRole === "companyAdmin"
												? "Company Admin"
												: userRole === "courseCommander"
													? "Course Commander"
													: userRole === "courseTrainer"
														? "Course Trainer"
														: "Trainee"}
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

						{/* Role Switcher Section */}
						<DropdownMenuSeparator />
						<DropdownMenuLabel className="text-xs font-normal text-gray-500">
							Switch Role View (Demo)
						</DropdownMenuLabel>
						<DropdownMenuItem
							onSelect={() =>
								window.dispatchEvent(
									new CustomEvent("switch-role", { detail: "superAdmin" }),
								)
							}
						>
							View as Super Admin
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								window.dispatchEvent(
									new CustomEvent("switch-role", { detail: "companyAdmin" }),
								)
							}
						>
							View as Company Admin
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								window.dispatchEvent(
									new CustomEvent("switch-role", { detail: "courseCommander" }),
								)
							}
						>
							View as Course Commander
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								window.dispatchEvent(
									new CustomEvent("switch-role", { detail: "courseTrainer" }),
								)
							}
						>
							View as Course Trainer
						</DropdownMenuItem>
						<DropdownMenuItem
							onSelect={() =>
								window.dispatchEvent(
									new CustomEvent("switch-role", { detail: "trainee" }),
								)
							}
						>
							View as Trainee
						</DropdownMenuItem>

						<DropdownMenuSeparator />
						<DropdownMenuItem>Sign out</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default Sidebar;
