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
import { Button } from "@/components/ui/button";

interface SidebarProps {
	activeTab: string;
	showSidebar: boolean;
	setShowSidebar: (show: boolean) => void;
	setActiveTab: (tab: string) => void;
	userRole?: UserRole;
	themeMode?: "light" | "dark" | "system";
}

const Sidebar = ({
	activeTab,
	showSidebar,
	setShowSidebar,
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

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--sidebar-width",
			showSidebar ? "16rem" : "5rem",
		);
	}, [showSidebar]);

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
			<div className="p-4 flex items-center justify-between">
				{showSidebar ? (
					<>
						<div className="flex-1 max-w-[160px]">
							<img
								src={currentLogo}
								alt="NeuroVibes Logo"
								className="w-full object-contain h-10"
							/>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowSidebar(false)}
							className="ml-2 p-0 h-8 w-8"
							aria-label="Collapse sidebar"
						>
							<span className="material-symbols-outlined text-gray-500">
								left_panel_close
							</span>
						</Button>
					</>
				) : (
					<div className="mx-auto">
						<div className="mb-2">
							<img
								src={logoCollapsed}
								alt="NeuroVibes Logo"
								className="w-10 h-10 object-contain"
							/>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setShowSidebar(true)}
							className="p-0 h-8 w-8 mx-auto"
							aria-label="Expand sidebar"
						>
							<span className="material-symbols-outlined text-gray-500">
								right_panel_close
							</span>
						</Button>
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
						<span
							className="material-symbols-outlined flex items-center justify-center"
							style={{
								fontSize: "20px",
								lineHeight: 1,
								width: "20px",
								height: "20px",
								display: "inline-flex",
							}}
						>
							dashboard
						</span>
						{showSidebar && <span className="ml-3 text-sm">Dashboard</span>}
					</div>
				)}

				{visibleTabs.includes("companies") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "companies" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("companies")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("companies")}
					>
						<span
							className="material-symbols-outlined flex items-center justify-center"
							style={{
								fontSize: "20px",
								lineHeight: 1,
								width: "20px",
								height: "20px",
								display: "inline-flex",
							}}
						>
							domain
						</span>
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
								<span
									className="material-symbols-outlined flex items-center justify-center"
									style={{
										fontSize: "20px",
										lineHeight: 1,
										width: "20px",
										height: "20px",
										display: "inline-flex",
									}}
								>
									manage_accounts
								</span>
								{showSidebar && (
									<span className="ml-3 text-sm">User Management</span>
								)}
							</div>
							{showSidebar && (
								<span
									className="material-symbols-outlined flex items-center justify-center transition-transform"
									style={{
										fontSize: "16px",
										lineHeight: 1,
										width: "16px",
										height: "16px",
										display: "inline-flex",
										transform: userMenuOpen ? "rotate(180deg)" : "",
									}}
								>
									expand_more
								</span>
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
									<span
										className="material-symbols-outlined flex items-center justify-center"
										style={{
											fontSize: "20px",
											lineHeight: 1,
											width: "20px",
											height: "20px",
											display: "inline-flex",
										}}
									>
										group
									</span>
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
									<span
										className="material-symbols-outlined flex items-center justify-center"
										style={{
											fontSize: "20px",
											lineHeight: 1,
											width: "20px",
											height: "20px",
											display: "inline-flex",
										}}
									>
										format_list_bulleted
									</span>
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
								<span
									className="material-symbols-outlined flex items-center justify-center"
									style={{
										fontSize: "20px",
										lineHeight: 1,
										width: "20px",
										height: "20px",
										display: "inline-flex",
									}}
								>
									menu_book
								</span>
								{showSidebar && (
									<span className="ml-3 text-sm">Course Management</span>
								)}
							</div>
							{showSidebar && (
								<span
									className="material-symbols-outlined flex items-center justify-center transition-transform"
									style={{
										fontSize: "16px",
										lineHeight: 1,
										width: "16px",
										height: "16px",
										display: "inline-flex",
										transform: courseMenuOpen ? "rotate(180deg)" : "",
									}}
								>
									expand_more
								</span>
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
									<span
										className="material-symbols-outlined flex items-center justify-center"
										style={{
											fontSize: "20px",
											lineHeight: 1,
											width: "20px",
											height: "20px",
											display: "inline-flex",
										}}
									>
										local_library
									</span>
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
									<span
										className="material-symbols-outlined flex items-center justify-center"
										style={{
											fontSize: "20px",
											lineHeight: 1,
											width: "20px",
											height: "20px",
											display: "inline-flex",
										}}
									>
										assignment
									</span>
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
						<span
							className="material-symbols-outlined flex items-center justify-center"
							style={{
								fontSize: "20px",
								lineHeight: 1,
								width: "20px",
								height: "20px",
								display: "inline-flex",
							}}
						>
							exercise
						</span>
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
						<span
							className="material-icons flex items-center justify-center"
							style={{
								fontSize: "20px",
								lineHeight: 1,
								width: "20px",
								height: "20px",
								display: "inline-flex",
							}}
						>
							psychology
						</span>
						{showSidebar && <span className="ml-3 text-sm">Psychological</span>}
					</div>
				)}

				{visibleTabs.includes("cognitive") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "cognitive" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("cognitive")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("cognitive")}
					>
						<span
							className="material-symbols-outlined flex items-center justify-center"
							style={{
								fontSize: "20px",
								lineHeight: 1,
								width: "20px",
								height: "20px",
								display: "inline-flex",
							}}
						>
							neurology
						</span>
						{showSidebar && <span className="ml-3 text-sm">Cognitive</span>}
					</div>
				)}

				{visibleTabs.includes("reports") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "reports" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("reports")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("reports")}
					>
						<span
							className="material-symbols-outlined flex items-center justify-center"
							style={{
								fontSize: "20px",
								lineHeight: 1,
								width: "20px",
								height: "20px",
								display: "inline-flex",
							}}
						>
							description
						</span>
						{showSidebar && <span className="ml-3 text-sm">Reports</span>}
					</div>
				)}

				{visibleTabs.includes("profile") && (
					<div
						className={`px-4 py-2 mt-1 ${activeTab === "profile" ? "bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "text-gray-600 dark:text-gray-300"} hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-md mx-2 flex items-center`}
						onClick={() => setActiveTab("profile")}
						onKeyDown={(e) => e.key === "Enter" && setActiveTab("profile")}
					>
						<span
							className="material-symbols-outlined flex items-center justify-center"
							style={{
								fontSize: "20px",
								lineHeight: 1,
								width: "20px",
								height: "20px",
								display: "inline-flex",
							}}
						>
							person
						</span>
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
