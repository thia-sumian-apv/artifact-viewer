import { useState, useEffect } from "react";
import type { Assessment } from "./components/AssessmentCard";
import Dashboard from "./components/Dashboard";
import ReportsTab from "./components/ReportsTab";
import ProfileTab from "./components/ProfileTab";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CoursesTab from "./components/CoursesTab";
import AssessmentRunsTab from "./components/AssessmentRunsTab";
import CompaniesTab from "./components/CompaniesTab";
import CohortsTab from "./components/CohortsTab";
import UsersTab from "./components/UsersTab";
import CommanderDashboard from "./components/dashboard/CommanderDashboard";
import { Toaster } from "sonner";
import TestAssessmentsTab from "./components/assessment-management/TestAssessmentsTab";
import TrainingModulesTab from "./components/assessment-management/TrainingModulesTab";
import { baseAssessments } from "./components/assessment-management/assessments";

export type UserRole =
  | "superAdmin"
  | "companyAdmin"
  | "courseCommander"
  | "courseTrainer"
  | "trainee";

const NeuroVibesPortal = () => {
  const [isSuperAdmin] = useState(true); // For demo, set to true
  const [activeTabState, setActiveTabState] = useState("dashboard");
  const [activeAssessmentType, setActiveAssessmentType] = useState<
    string | undefined
  >(undefined);

  const setActiveTab = (tab: string) => {
    // Check if tab is an assessment type that should redirect to testAssessments
    if (tab === "cognitive" || tab === "psychological" || tab === "physical") {
      setActiveAssessmentType(tab);
      setActiveTabState("testAssessments");
    } else {
      setActiveAssessmentType(undefined);
      setActiveTabState(tab);
    }
  };

  const [assessments, setAssessments] = useState<{
    cognitive: Assessment[];
    psychological: Assessment[];
    physical: Assessment[];
  }>({
    cognitive: [],
    psychological: [],
    physical: [],
  });
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(
    "light"
  );
  const [userRole, setUserRole] = useState<UserRole>("trainee");
  // Listen for role switch events
  useEffect(() => {
    const handleRoleSwitch = (event: CustomEvent<UserRole>) => {
      setUserRole(event.detail);
      // Optionally reset to dashboard when switching roles
      setActiveTab("dashboard");
    };

    window.addEventListener("switch-role", handleRoleSwitch as EventListener);

    return () => {
      window.removeEventListener(
        "switch-role",
        handleRoleSwitch as EventListener
      );
    };
  }, []);

  useEffect(() => {
    // Simulate API call to fetch available assessments
    setTimeout(() => {
      setAssessments({ ...baseAssessments });
      setLoading(false);
    }, 1000);
  }, []);

  const viewReport = (id: string) => {
    console.log(`Viewing report for: ${id}`);
    // This would open the assessment report
  };

  // Calculate progress percentages
  const getCognitiveProgress = () => {
    const completed = assessments.cognitive.filter(
      (a) => a.status === "completed"
    ).length;
    return {
      count: completed, // Return number instead of string
      percentage:
        Math.round((completed / assessments.cognitive.length) * 100) || 0,
    };
  };

  const getPsychologicalProgress = () => {
    const completed = assessments.psychological.filter(
      (a) => a.status === "completed"
    ).length;
    return {
      count: completed,
      percentage:
        Math.round((completed / assessments.psychological.length) * 100) || 0,
    };
  };

  const getPhysicalProgress = () => {
    const completed = assessments.physical.filter(
      (a) => a.status === "completed"
    ).length;
    return {
      count: completed,
      percentage:
        Math.round((completed / assessments.physical.length) * 100) || 0,
    };
  };

  const getOverallProgress = () => {
    const totalAssessments =
      assessments.cognitive.length +
      assessments.psychological.length +
      assessments.physical.length;
    const completed =
      assessments.cognitive.filter((a) => a.status === "completed").length +
      assessments.psychological.filter((a) => a.status === "completed").length +
      assessments.physical.filter((a) => a.status === "completed").length;

    return {
      count: completed,
      percentage: Math.round((completed / totalAssessments) * 100) || 0,
    };
  };

  const cognitiveProgress = getCognitiveProgress();
  const psychologicalProgress = getPsychologicalProgress();
  const overallProgress = getOverallProgress();

  const isViewCommanderDashboard = (role: UserRole): boolean => {
    return ["superAdmin", "companyAdmin", "courseCommander"].includes(role);
  };

  // Render the appropriate tab content
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 dark:border-teal-400" />
        </div>
      );
    }

    switch (activeTabState) {
      case "dashboard":
        // Show CommanderDashboard for course commanders, regular Dashboard for others
        return isViewCommanderDashboard(userRole) ? (
          <CommanderDashboard />
        ) : (
          <Dashboard
            cognitiveProgress={cognitiveProgress}
            psychologicalProgress={psychologicalProgress}
            overallProgress={overallProgress}
            getPhysicalProgress={getPhysicalProgress}
            setActiveTab={setActiveTab}
            viewReport={viewReport}
            userRole={userRole}
          />
        );

      case "reports":
        return <ReportsTab assessments={assessments} viewReport={viewReport} />;

      case "profile":
        return <ProfileTab />;

      case "courses":
        return <CoursesTab />;

      case "assessmentRuns":
        return <AssessmentRunsTab />;

      case "companies":
        // Only render if super admin
        return isSuperAdmin ? <CompaniesTab /> : null;

      case "users":
        return <UsersTab />;

      case "cohorts":
        return <CohortsTab />;

      case "testAssessments":
        return (
          <TestAssessmentsTab
            userRole={userRole}
            initialAssessmentType={activeAssessmentType}
          />
        );

      case "trainingModules":
        return <TrainingModulesTab />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex">
      <Toaster position="bottom-right" richColors />
      {/* Sidebar */}
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        activeTab={activeTabState}
        setActiveTab={setActiveTab}
        themeMode={themeMode}
        userRole={userRole}
      />

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300 flex flex-col"
        style={{ marginLeft: "var(--sidebar-width, 16rem)" }}
      >
        {/* Header */}
        <Header
          activeTab={activeTabState}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />

        {/* Main Content */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
          {renderTabContent()}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default NeuroVibesPortal;
