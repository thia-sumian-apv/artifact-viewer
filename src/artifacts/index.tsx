import { useState, useEffect } from "react";
import { Users, Award } from "lucide-react";
import type { Assessment } from "./components/AssessmentCard";
import Dashboard from "./components/Dashboard";
import CognitiveTab from "./components/CognitiveTab";
import PsychologicalTab from "./components/PsychologicalTab";
import PhysicalTab from "./components/PhysicalTab";
import ReportsTab from "./components/ReportsTab";
import ProfileTab from "./components/ProfileTab";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CoursesTab from "./components/CoursesTab";
import AssessmentRunsTab from "./components/AssessmentRunsTab";
import SARTTraining from "./components/assessments/sart/SARTTraining";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CompaniesTab from "./components/CompaniesTab";
import CohortsTab from "./components/CohortsTab";
import UsersTab from "./components/UsersTab";
import CommanderDashboard from "./components/dashboard/CommanderDashboard";
import { Toaster } from "sonner";
import PhysicalStatsAdminView from "./components/physical/PhysicalStatsAdminView";

export type UserRole =
	| "superAdmin"
	| "companyAdmin"
	| "courseCommander"
	| "courseTrainer"
	| "trainee";

const NeuroVibesPortal = () => {
	const [isSuperAdmin, _setIsSuperAdmin] = useState(true); // For demo, set to true
	const [activeTab, setActiveTab] = useState("dashboard");
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
	const [currentAssessment, setCurrentAssessment] = useState<string | null>(
		null,
	);
	const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
	const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">(
		"light",
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
				handleRoleSwitch as EventListener,
			);
		};
	}, []);

	useEffect(() => {
		// Simulate API call to fetch available assessments
		setTimeout(() => {
			setAssessments({
				cognitive: [
					{
						id: "sart",
						title: "Sustained Attention Response Task (SART)",
						description:
							"Measures your ability to maintain focus and suppress impulsive responses over time.",
						duration: "10-12 mins",
						status: "completed",
						progress: 100,
						score: 87,
						icon: (
							<span
								className="material-symbols-outlined flex items-center justify-center"
								style={{
									fontSize: "24px",
									lineHeight: 1,
									width: "24px",
									height: "24px",
									display: "inline-flex",
								}}
							>
								neurology
							</span>
						),
						type: "cognitive",
					},
					{
						id: "vrxn",
						title: "Visual Recognition (RXN)",
						description:
							"Tests your ability to memorize and identify visual patterns under time constraints.",
						duration: "15-20 mins",
						status: "in_progress",
						progress: 60,
						icon: (
							<span
								className="material-icons flex items-center justify-center"
								style={{
									fontSize: "24px",
									lineHeight: 1,
									width: "24px",
									height: "24px",
									display: "inline-flex",
								}}
							>
								psychology
							</span>
						),
						type: "cognitive",
					},
					{
						id: "spatial",
						title: "Spatial Planning",
						description:
							"Evaluates your ability to visualize and strategize spatial arrangements with minimal moves.",
						duration: "12-15 mins",
						status: "available",
						progress: 0,
						icon: (
							<span
								className="material-symbols-outlined flex items-center justify-center"
								style={{
									fontSize: "24px",
									lineHeight: 1,
									width: "24px",
									height: "24px",
									display: "inline-flex",
								}}
							>
								neurology
							</span>
						),
						type: "cognitive",
					},
					{
						id: "sart-training",
						title: "SART Training",
						description:
							"Sustained Attention to Response Task training exercise",
						duration: "5-10 mins",
						status: "available",
						progress: 0,
						icon: (
							<span
								className="material-symbols-outlined flex items-center justify-center"
								style={{
									fontSize: "24px",
									lineHeight: 1,
									width: "24px",
									height: "24px",
									display: "inline-flex",
								}}
							>
								neurology
							</span>
						),
						type: "cognitive",
					},
				],

				psychological: [
					{
						id: "ml360",
						title: "Mindful Leadership Assessment (ML360)",
						description:
							"Evaluates leadership behaviors reflecting mindfulness in workplace scenarios.",
						duration: "15-20 mins",
						status: "completed",
						progress: 100,
						score: 92,
						icon: <Users className="h-6 w-6" />,
						type: "psychological",
					},
					{
						id: "teamres",
						title: "Team Resilience Assessment",
						description:
							"Measures your team's ability to bounce back from challenges and adapt to change.",
						duration: "10-15 mins",
						status: "available",
						progress: 0,
						icon: <Users className="h-6 w-6" />,
						type: "psychological",
					},
					{
						id: "selfdet",
						title: "Self-Determination Assessment",
						description:
							"Evaluates your motivation level and sense of autonomy, competence, and relatedness.",
						duration: "10 mins",
						status: "available",
						progress: 0,
						icon: (
							<span className="material-icons" style={{ fontSize: "24px" }}>
								psychology
							</span>
						),
						type: "psychological",
					},
				],

				physical: [
					{
						id: "cardio",
						title: "Cardio-Respiratory Fitness",
						description: "Results from your VO2 Max and endurance testing.",
						status: "completed",
						date: "2 Mar 2025",
						score: 78,
						icon: (
							<span
								className="material-symbols-outlined flex items-center justify-center"
								style={{
									fontSize: "24px",
									lineHeight: 1,
									width: "24px",
									height: "24px",
									display: "inline-flex",
								}}
							>
								exercise
							</span>
						),
						type: "physical",
					},
					{
						id: "strength",
						title: "Strength Assessment",
						description: "Measurements from resistance training evaluation.",
						status: "completed",
						date: "28 Feb 2025",
						score: 82,
						icon: <Award className="h-6 w-6" />,
						type: "physical",
					},
					{
						id: "ippt",
						title: "IPPT Results",
						description:
							"Individual Physical Proficiency Test scores and analysis.",
						status: "completed",
						date: "15 Feb 2025",
						score: 85,
						icon: <Award className="h-6 w-6" />,
						type: "physical",
					},
				],
			});
			setLoading(false);
		}, 1000);
	}, []);

	const startAssessment = (id: string) => {
		console.log(`Starting assessment: ${id}`);
		if (id === "sart-training") {
			// Here you would navigate to the SART training page
			// For example with React Router:
			// navigate("/assessments/sart-training");

			// If you're using a modal approach instead:
			setCurrentAssessment("sart-training");
			setAssessmentModalOpen(true);

			// If this is just a proof of concept, you could replace the current view
			// with the SARTTraining component
		}
	};

	const viewReport = (id: string) => {
		console.log(`Viewing report for: ${id}`);
		// This would open the assessment report
	};

	// Calculate progress percentages
	const getCognitiveProgress = () => {
		const completed = assessments.cognitive.filter(
			(a) => a.status === "completed",
		).length;
		return {
			count: completed, // Return number instead of string
			percentage:
				Math.round((completed / assessments.cognitive.length) * 100) || 0,
		};
	};

	const getPsychologicalProgress = () => {
		const completed = assessments.psychological.filter(
			(a) => a.status === "completed",
		).length;
		return {
			count: completed,
			percentage:
				Math.round((completed / assessments.psychological.length) * 100) || 0,
		};
	};

	const getPhysicalProgress = () => {
		const completed = assessments.physical.filter(
			(a) => a.status === "completed",
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

	// Render the appropriate tab content
	const renderTabContent = () => {
		if (loading) {
			return (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 dark:border-teal-400" />
				</div>
			);
		}

		switch (activeTab) {
			case "dashboard":
				// Show CommanderDashboard for course commanders, regular Dashboard for others
				return userRole === "courseCommander" ? (
					<CommanderDashboard />
				) : (
					<Dashboard
						assessments={assessments}
						cognitiveProgress={cognitiveProgress}
						psychologicalProgress={psychologicalProgress}
						overallProgress={overallProgress}
						getPhysicalProgress={getPhysicalProgress}
						setActiveTab={setActiveTab}
						viewReport={viewReport}
					/>
				);

			case "cognitive":
				return (
					<CognitiveTab
						assessments={assessments}
						startAssessment={startAssessment}
						viewReport={viewReport}
					/>
				);

			case "psychological":
				return (
					<PsychologicalTab
						assessments={assessments}
						startAssessment={startAssessment}
						viewReport={viewReport}
					/>
				);

			case "physical":
				return userRole === "companyAdmin" || userRole === "superAdmin" ? (
					<PhysicalStatsAdminView />
				) : (
					<PhysicalTab
						assessments={assessments}
						startAssessment={startAssessment}
						viewReport={viewReport}
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
				activeTab={activeTab}
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
					activeTab={activeTab}
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

			<Dialog open={assessmentModalOpen} onOpenChange={setAssessmentModalOpen}>
				<DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] h-[90vh] p-0 overflow-hidden">
					{currentAssessment === "sart-training" && (
						<SARTTraining onClose={() => setAssessmentModalOpen(false)} />
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default NeuroVibesPortal;
