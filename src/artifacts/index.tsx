import { useState, useEffect } from "react";
import { Brain, Activity, Users, Dumbbell, Award } from "lucide-react";
import type { Assessment } from "./components/AssessmentCard";
import Dashboard from "./components/Dashboard";
import AssessmentProgress from "./components/AssessmentProgress";
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

const NeuroVibesPortal = () => {
	const [darkMode, setDarkMode] = useState(() => {
		// Check localStorage first
		const savedMode = localStorage.getItem("darkMode");
		if (savedMode !== null) {
			return savedMode === "true";
		}
		// Otherwise, use dark mode by default
		return true;
	});
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
						icon: <Brain className="h-6 w-6" />,
					},
					{
						id: "vrxn",
						title: "Visual Recognition (RXN)",
						description:
							"Tests your ability to memorize and identify visual patterns under time constraints.",
						duration: "15-20 mins",
						status: "in_progress",
						progress: 60,
						icon: <Activity className="h-6 w-6" />,
					},
					{
						id: "spatial",
						title: "Spatial Planning",
						description:
							"Evaluates your ability to visualize and strategize spatial arrangements with minimal moves.",
						duration: "12-15 mins",
						status: "available",
						progress: 0,
						icon: <Brain className="h-6 w-6" />,
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
					},
					{
						id: "selfdet",
						title: "Self-Determination Assessment",
						description:
							"Evaluates your motivation level and sense of autonomy, competence, and relatedness.",
						duration: "10 mins",
						status: "available",
						progress: 0,
						icon: <Activity className="h-6 w-6" />,
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
						icon: <Dumbbell className="h-6 w-6" />,
					},
					{
						id: "strength",
						title: "Strength Assessment",
						description: "Measurements from resistance training evaluation.",
						status: "completed",
						date: "28 Feb 2025",
						score: 82,
						icon: <Award className="h-6 w-6" />,
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
					},
				],
			});
			setLoading(false);
		}, 1000);
	}, []);

	// Apply dark mode class to document
	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}

		// Save preference to localStorage
		localStorage.setItem("darkMode", darkMode.toString());
	}, [darkMode]);

	const startAssessment = (id: string) => {
		console.log(`Starting assessment: ${id}`);
		// This would navigate to the specific assessment
	};

	const viewReport = (id: string) => {
		console.log(`Viewing report for: ${id}`);
		// This would open the assessment report
	};

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
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
				return (
					<>
						<AssessmentProgress
							cognitiveProgress={cognitiveProgress}
							psychologicalProgress={psychologicalProgress}
							getPhysicalProgress={getPhysicalProgress}
							overallProgress={overallProgress}
							setActiveTab={setActiveTab}
						/>

						<Dashboard
							assessments={assessments}
							cognitiveProgress={cognitiveProgress}
							psychologicalProgress={psychologicalProgress}
							overallProgress={overallProgress}
							getPhysicalProgress={getPhysicalProgress}
							setActiveTab={setActiveTab}
							viewReport={viewReport}
						/>
					</>
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
				return (
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

			default:
				return null;
		}
	};

	return (
		<div
			className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex`}
		>
			{/* Sidebar */}
			<Sidebar
				showSidebar={showSidebar}
				setShowSidebar={setShowSidebar}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				darkMode={darkMode}
				toggleDarkMode={toggleDarkMode}
			/>

			{/* Main Content */}
			<div
				className={`${showSidebar ? "ml-64" : "ml-20"} flex-1 transition-all duration-300 flex flex-col`}
			>
				{/* Header */}
				<Header
					activeTab={activeTab}
					showSidebar={showSidebar}
					setShowSidebar={setShowSidebar}
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
