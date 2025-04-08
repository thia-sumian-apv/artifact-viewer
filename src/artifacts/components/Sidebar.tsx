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
import {
  PanelLeftClose,
  PanelRightClose,
  LayoutDashboard,
  Building2,
  User,
  ChevronDown,
  Users,
  ListTodo,
  BookOpen,
  GraduationCap,
  ClipboardList,
  ClipboardPen,
  BookCheck,
  School,
  FileText,
  UserPen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  activeTab: string;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
  userRole?: UserRole;
  themeMode?: "light" | "dark" | "system";
}

// Consistent style classes
const menuItemBaseStyle = `
  px-4 py-2.5
  mx-2
  rounded-md
  flex items-center
  transition-all duration-200
  cursor-pointer
`;

const menuItemActiveStyle = `
  bg-teal-50 dark:bg-teal-900/30 
  text-teal-600 dark:text-teal-400
`;

const menuItemInactiveStyle = `
  text-gray-600 dark:text-gray-300
  hover:bg-gray-50 dark:hover:bg-gray-700
`;

const Sidebar = ({
  activeTab,
  showSidebar,
  setShowSidebar,
  setActiveTab,
  themeMode = "light",
  userRole = "trainee",
}: SidebarProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const shouldShowSidebar = showSidebar || (!showSidebar && isHovered);
  const [courseMenuOpen, setCourseMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(lightLogo);
  const [assessmentMenuOpen, setAssessmentMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      shouldShowSidebar ? "16rem" : "5rem"
    );
  }, [shouldShowSidebar]);

  useEffect(() => {
    if (themeMode === "dark") {
      setCurrentLogo(darkLogo);
    } else if (themeMode === "light") {
      setCurrentLogo(lightLogo);
    } else if (themeMode === "system") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setCurrentLogo(isDarkMode ? darkLogo : lightLogo);
    }
  }, [themeMode]);

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

  // Role permissions remain the same...
  const rolePermissions = {
    superAdmin: [
      "dashboard",
      "companies",
      "users",
      "course",
      "assessmentManagement",
      "reports",
      "profile",
    ],
    companyAdmin: [
      "dashboard",
      "companies",
      "users",
      "course",
      "assessmentManagement",
      "reports",
      "profile",
    ],
    courseCommander: [
      "dashboard",
      "companies",
      "course",
      "assessmentManagement",
      "reports",
      "profile",
    ],
    courseTrainer: ["dashboard", "assessmentManagement", "reports", "profile"],
    trainee: ["dashboard", "assessmentManagement", "reports", "profile"],
  };

  const visibleTabs = rolePermissions[userRole] || rolePermissions.trainee;

  const renderMenuItem = (
    icon: React.ReactNode,
    label: string,
    isActive: boolean,
    onClick: () => void,
    hasSubmenu = false,
    isSubmenuOpen = false
  ) => (
    <div
      className={`
      ${menuItemBaseStyle}
      ${isActive ? menuItemActiveStyle : menuItemInactiveStyle}
      ${hasSubmenu ? "justify-between" : ""}
      mt-1
      overflow-hidden // Add this to prevent content from affecting width
    `}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center min-w-0">
        {" "}
        {/* Add min-w-0 to allow text truncation */}
        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
          {icon}
        </div>
        {shouldShowSidebar && (
          <span
            className={`
          ml-3 text-sm whitespace-nowrap
          transition-all duration-300 delay-75 // Add delay to text appearance
          ${
            shouldShowSidebar
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
          }
        `}
          >
            {label}
          </span>
        )}
      </div>
      {hasSubmenu && shouldShowSidebar && (
        <ChevronDown
          className="h-4 w-4 flex-shrink-0 transition-transform duration-200 ml-2"
          style={{
            transform: isSubmenuOpen ? "rotate(180deg)" : "",
          }}
        />
      )}
    </div>
  );

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setIsHovered(false);

    // Temporarily disable hover detection for a short time
    // to prevent immediate re-hover
    const element = document.querySelector(".sidebar-container") as HTMLElement;
    if (element) {
      element.style.pointerEvents = "none";
      setTimeout(() => {
        element.style.pointerEvents = "auto";
      }, 300);
    }
  };

  return (
    <div
      className={`
        sidebar-container
        ${shouldShowSidebar ? "w-64" : "w-20"} 
        bg-white dark:bg-gray-800 
        h-screen shadow-md fixed 
        transition-all duration-300 ease-in-out z-10 
      `}
      onMouseEnter={() => !showSidebar && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 flex items-center justify-between">
        {shouldShowSidebar ? (
          <>
            <div className="flex-1 max-w-[160px]">
              <img
                src={currentLogo}
                alt="NeuroVibes Logo"
                className="w-full object-contain h-10"
              />
            </div>
            {!isHovered ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloseSidebar}
                      className="ml-2 p-0 h-8 w-8"
                      aria-label="Collapse sidebar"
                    >
                      <PanelLeftClose className="h-5 w-5 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Close Sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowSidebar(true);
                        setIsHovered(false);
                      }}
                      className="ml-2 p-0 h-8 w-8"
                      aria-label="Expand sidebar"
                    >
                      <PanelRightClose className="h-5 w-5 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Keep Sidebar Open</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </>
        ) : (
          <>
            <div
              className={`flex-1 max-w-[160px] transition-all duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={currentLogo}
                alt="NeuroVibes Logo"
                className="w-full object-contain h-10"
              />
            </div>
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            >
              <img
                src={logoCollapsed}
                alt="NeuroVibes Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {visibleTabs.includes("dashboard") &&
          renderMenuItem(
            <LayoutDashboard className="h-5 w-5" />,
            "Dashboard",
            activeTab === "dashboard",
            () => setActiveTab("dashboard")
          )}

        {visibleTabs.includes("companies") &&
          renderMenuItem(
            <Building2 className="h-5 w-5" />,
            "Companies",
            activeTab === "companies",
            () => setActiveTab("companies")
          )}

        {visibleTabs.includes("users") && (
          <div className="relative">
            {renderMenuItem(
              <User className="h-5 w-5" />,
              "User Management",
              activeTab === "users",
              () => shouldShowSidebar && setUserMenuOpen(!userMenuOpen),
              true,
              userMenuOpen
            )}

            {shouldShowSidebar && userMenuOpen && (
              <div className="ml-6 mt-1 relative">
                <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-gray-200 dark:bg-gray-700" />
                {renderMenuItem(
                  <Users className="h-5 w-5" />,
                  "Users",
                  activeTab === "users",
                  () => setActiveTab("users")
                )}
                {renderMenuItem(
                  <ListTodo className="h-5 w-5" />,
                  "Cohorts",
                  activeTab === "cohorts",
                  () => setActiveTab("cohorts")
                )}
              </div>
            )}
          </div>
        )}

        {/* Course Management Section */}
        {visibleTabs.includes("course") && (
          <div className="relative">
            {renderMenuItem(
              <BookOpen className="h-5 w-5" />,
              "Course Management",
              activeTab === "course",
              () => shouldShowSidebar && setCourseMenuOpen(!courseMenuOpen),
              true,
              courseMenuOpen
            )}

            {shouldShowSidebar && courseMenuOpen && (
              <div className="ml-6 mt-1 relative">
                <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-gray-200 dark:bg-gray-700" />
                {renderMenuItem(
                  <GraduationCap className="h-5 w-5" />,
                  "Courses",
                  activeTab === "courses",
                  () => setActiveTab("courses")
                )}
                {renderMenuItem(
                  <ClipboardList className="h-5 w-5" />,
                  "Assessment Runs",
                  activeTab === "assessmentRuns",
                  () => setActiveTab("assessmentRuns")
                )}
              </div>
            )}
          </div>
        )}

        {/* Assessment Management Section */}
        {visibleTabs.includes("assessmentManagement") && (
          <div className="relative">
            {renderMenuItem(
              <ClipboardPen className="h-5 w-5" />,
              "Assessments",
              activeTab === "assessmentManagement",
              () =>
                shouldShowSidebar && setAssessmentMenuOpen(!assessmentMenuOpen),
              true,
              assessmentMenuOpen
            )}

            {shouldShowSidebar && assessmentMenuOpen && (
              <div className="ml-6 mt-1 relative">
                <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-gray-200 dark:bg-gray-700" />
                {renderMenuItem(
                  <BookCheck className="h-5 w-5" />,
                  "Test Assessments",
                  activeTab === "testAssessments",
                  () => setActiveTab("testAssessments")
                )}
                {renderMenuItem(
                  <School className="h-5 w-5" />,
                  "Training Modules",
                  activeTab === "trainingModules",
                  () => setActiveTab("trainingModules")
                )}
              </div>
            )}
          </div>
        )}

        {visibleTabs.includes("reports") &&
          renderMenuItem(
            <FileText className="h-5 w-5" />,
            "Reports",
            activeTab === "reports",
            () => setActiveTab("reports")
          )}

        {visibleTabs.includes("profile") &&
          renderMenuItem(
            <UserPen className="h-5 w-5" />,
            "Profile",
            activeTab === "profile",
            () => setActiveTab("profile")
          )}
      </nav>

      {/* User Profile Section */}
      <div className="absolute bottom-4 w-full px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`
                w-full flex items-center
                ${shouldShowSidebar ? "px-2 py-3" : "justify-center p-2"}
                bg-gray-100 dark:bg-gray-700 
                rounded-lg 
                hover:bg-gray-200 dark:hover:bg-gray-600
                transition-all duration-200
              `}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-500 dark:text-teal-300">
                  JD
                </AvatarFallback>
              </Avatar>
              {shouldShowSidebar && (
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
                  new CustomEvent("switch-role", { detail: "superAdmin" })
                )
              }
            >
              View as Super Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                window.dispatchEvent(
                  new CustomEvent("switch-role", { detail: "companyAdmin" })
                )
              }
            >
              View as Company Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                window.dispatchEvent(
                  new CustomEvent("switch-role", { detail: "courseCommander" })
                )
              }
            >
              View as Course Commander
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                window.dispatchEvent(
                  new CustomEvent("switch-role", { detail: "courseTrainer" })
                )
              }
            >
              View as Course Trainer
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                window.dispatchEvent(
                  new CustomEvent("switch-role", { detail: "trainee" })
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
