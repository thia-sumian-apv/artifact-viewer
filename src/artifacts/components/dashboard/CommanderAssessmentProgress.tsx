import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar, Users } from "lucide-react";

// Only require minimal props now - the component handles its own data
interface CompanyAssessmentProgressProps {
	onCompanyChange?: (companyId: string) => void;
	onRunChange?: (runId: string) => void;
}

const CompanyAssessmentProgress: React.FC<CompanyAssessmentProgressProps> = ({
	onCompanyChange,
	onRunChange,
}) => {
	// Internal state management for the selectors
	const [selectedCompany, setSelectedCompany] = useState<string>("company-1");
	const [selectedRun, setSelectedRun] = useState<string>("current-run");

	// Sample companies data
	const companies = [
		{ id: "company-1", name: "Alpha Company", totalTrainees: 56 },
		{ id: "company-2", name: "Bravo Company", totalTrainees: 62 },
		{ id: "company-3", name: "Charlie Company", totalTrainees: 48 },
	];

	// Sample assessment runs data
	const assessmentRuns = [
		{
			id: "current-run",
			name: "Q2 2023 Assessment",
			startDate: "April 1, 2023",
			endDate: "June 30, 2023",
			status: "completed" as const,
			nextScheduled: "October 1, 2023",
		},
		{
			id: "previous-run",
			name: "Q1 2023 Assessment",
			startDate: "January 1, 2023",
			endDate: "March 31, 2023",
			status: "completed" as const,
		},
		{
			id: "upcoming-run",
			name: "Q3 2023 Assessment",
			startDate: "October 1, 2023",
			endDate: "December 31, 2023",
			status: "upcoming" as const,
		},
	];

	// Sample progress data
	const progressData = {
		"company-1": {
			physical: { count: 50, percentage: 90 },
			cognitive: { count: 56, percentage: 100 },
			psychological: { count: 56, percentage: 100 },
			overall: { count: 162, percentage: 96 },
		},
		"company-2": {
			physical: { count: 58, percentage: 94 },
			cognitive: { count: 60, percentage: 97 },
			psychological: { count: 62, percentage: 100 },
			overall: { count: 180, percentage: 97 },
		},
		"company-3": {
			physical: { count: 42, percentage: 88 },
			cognitive: { count: 45, percentage: 94 },
			psychological: { count: 48, percentage: 100 },
			overall: { count: 135, percentage: 94 },
		},
	};

	// Find the currently selected run info and company info
	const currentRunInfo = assessmentRuns.find((run) => run.id === selectedRun);
	const selectedCompanyInfo = companies.find(
		(company) => company.id === selectedCompany,
	);

	// Get the appropriate progress data for the selected company
	const progress = progressData[selectedCompany as keyof typeof progressData];

	// Handle company change
	const handleCompanyChange = (companyId: string) => {
		setSelectedCompany(companyId);
		if (onCompanyChange) {
			onCompanyChange(companyId);
		}
	};

	// Handle assessment run change
	const handleRunChange = (runId: string) => {
		setSelectedRun(runId);
		if (onRunChange) {
			onRunChange(runId);
		}
	};

	return (
		<Card className="mb-6 shadow-sm border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
			<CardHeader className="pb-2 p-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
					<CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
						Company Assessment Dashboard
					</CardTitle>
					<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
						<div className="flex items-center space-x-2">
							<span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
								Company:
							</span>
							<Select
								value={selectedCompany}
								onValueChange={handleCompanyChange}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select Company" />
								</SelectTrigger>
								<SelectContent>
									{companies.map((company) => (
										<SelectItem key={company.id} value={company.id}>
											{company.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2">
							<span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
								Assessment Run:
							</span>
							<Select value={selectedRun} onValueChange={handleRunChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select Assessment Run" />
								</SelectTrigger>
								<SelectContent>
									{assessmentRuns.map((run) => (
										<SelectItem key={run.id} value={run.id}>
											{run.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-6 pt-0">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					{/* Left column: Assessment info */}
					<Card className="col-span-1 shadow-sm border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
						<CardContent className="p-4">
							<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
								<Calendar className="h-4 w-4 mr-1 text-blue-500" />
								Assessment Info
							</h3>

							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500 dark:text-gray-400">
										Status:
									</span>
									<span
										className={`text-xs font-medium px-2 py-1 rounded-full ${
											currentRunInfo?.status === "completed"
												? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
												: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
										}`}
									>
										{currentRunInfo?.status === "completed"
											? "Completed"
											: currentRunInfo?.status === "upcoming"
												? "Upcoming"
												: "In Progress"}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500 dark:text-gray-400">
										Start Date:
									</span>
									<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
										{currentRunInfo?.startDate}
									</span>
								</div>

								<div className="flex items-center justify-between">
									<span className="text-xs text-gray-500 dark:text-gray-400">
										End Date:
									</span>
									<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
										{currentRunInfo?.endDate}
									</span>
								</div>

								{currentRunInfo?.nextScheduled && (
									<div className="flex items-center justify-between">
										<span className="text-xs text-gray-500 dark:text-gray-400">
											Next Assessment:
										</span>
										<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
											{currentRunInfo.nextScheduled}
										</span>
									</div>
								)}

								<div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
									<div className="flex items-center justify-between">
										<span className="text-xs text-gray-500 dark:text-gray-400">
											Company Size:
										</span>
										<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
											{selectedCompanyInfo?.totalTrainees} Trainees
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Right columns: Progress metrics (simplified) */}
					<div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Physical Assessment Card */}
						<Card className="bg-gradient-to-br from-purple-500/90 to-pink-500/90 dark:from-purple-600/90 dark:to-pink-600/90 text-white border-0 shadow-md">
							<CardContent className="p-4">
								<div className="flex items-center justify-between mb-3">
									<h4 className="text-sm font-medium text-white">
										Physical Assessment
									</h4>
									<span
										className="material-symbols-outlined"
										style={{ fontSize: "24px", lineHeight: 1 }}
									>
										exercise
									</span>{" "}
								</div>

								<div className="flex items-center justify-between mb-1.5">
									<span className="text-xs text-white/90">Completed:</span>
									<span className="text-sm font-semibold">
										{progress.physical.count}/
										{selectedCompanyInfo?.totalTrainees}
									</span>
								</div>

								<Progress
									value={progress.physical.percentage}
									className="h-2 mb-1 bg-white/20 [&>div]:bg-white"
								/>

								<div className="flex justify-between mt-1">
									<span className="text-xs text-white/80">
										{progress.physical.percentage}% Complete
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Psychological Assessment Card */}
						<Card className="bg-gradient-to-br from-blue-500/90 to-indigo-500/90 dark:from-blue-600/90 dark:to-indigo-600/90 text-white border-0 shadow-md">
							<CardContent className="p-4">
								<div className="flex items-center justify-between mb-3">
									<h4 className="text-sm font-medium text-white">
										Psychological Assessment
									</h4>
									<span
										className="material-icons"
										style={{ fontSize: "24px", lineHeight: 1 }}
									>
										psychology
									</span>
								</div>

								<div className="flex items-center justify-between mb-1.5">
									<span className="text-xs text-white/90">Completed:</span>
									<span className="text-sm font-semibold">
										{progress.psychological.count}/
										{selectedCompanyInfo?.totalTrainees}
									</span>
								</div>

								<Progress
									value={progress.psychological.percentage}
									className="h-2 mb-1 bg-white/20 [&>div]:bg-white"
								/>

								<div className="flex justify-between mt-1">
									<span className="text-xs text-white/80">
										{progress.psychological.percentage}% Complete
									</span>
								</div>
							</CardContent>
						</Card>

						{/* Cognitive Assessment Card */}
						<Card className="bg-gradient-to-br from-teal-500/90 to-blue-500/90 dark:from-teal-600/90 dark:to-blue-600/90 text-white border-0 shadow-md">
							<CardContent className="p-4">
								<div className="flex items-center justify-between mb-3">
									<h4 className="text-sm font-medium text-white">
										Cognitive Assessment
									</h4>
									<span
										className="material-symbols-outlined"
										style={{ fontSize: "24px", lineHeight: 1 }}
									>
										neurology
									</span>
								</div>

								<div className="flex items-center justify-between mb-1.5">
									<span className="text-xs text-white/90">Completed:</span>
									<span className="text-sm font-semibold">
										{progress.cognitive.count}/
										{selectedCompanyInfo?.totalTrainees}
									</span>
								</div>

								<Progress
									value={progress.cognitive.percentage}
									className="h-2 mb-1 bg-white/20 [&>div]:bg-white"
								/>

								<div className="flex justify-between mt-1">
									<span className="text-xs text-white/80">
										{progress.cognitive.percentage}% Complete
									</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Overall progress row spanning full width */}
					<Card className="col-span-1 lg:col-span-4 bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm">
						<CardContent className="p-4">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center">
									<Users className="h-4 w-4 mr-1.5 text-blue-500" />
									<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Overall Assessment Progress
									</h3>
								</div>
								<div className="text-sm font-medium text-blue-600 dark:text-blue-400">
									{progress.overall.count} of{" "}
									{(selectedCompanyInfo?.totalTrainees ?? 0) * 3} total
									assessments
								</div>
							</div>

							<div className="relative pt-1">
								<div className="flex items-center justify-between mb-1">
									<div>
										<span className="text-xs font-semibold inline-block text-gray-600 dark:text-gray-400">
											Company-wide completion rate
										</span>
									</div>
									<div className="text-right">
										<span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
											{progress.overall.percentage}%
										</span>
									</div>
								</div>
								<div className="overflow-hidden h-2.5 text-xs flex rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
									<div
										style={{ width: `${progress.overall.percentage}%` }}
										className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-500"
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-2 text-center mt-1">
								<div className="px-1">
									<div className="text-xs font-medium text-gray-600 dark:text-gray-400">
										Physical
									</div>
									<div className="flex items-center justify-center space-x-1 mt-1">
										<span
											className="material-symbols-outlined  text-purple-500"
											style={{ fontSize: "16px", lineHeight: 1 }}
										>
											exercise
										</span>
										<span className="text-xs font-semibold">
											{progress.physical.percentage}%
										</span>
									</div>
								</div>
								<div className="px-1">
									<div className="text-xs font-medium text-gray-600 dark:text-gray-400">
										Psychological
									</div>
									<div className="flex items-center justify-center space-x-1 mt-1">
										<span
											className="material-icons  text-blue-500"
											style={{ fontSize: "16px", lineHeight: 1 }}
										>
											psychology
										</span>
										<span className="text-xs font-semibold">
											{progress.psychological.percentage}%
										</span>
									</div>
								</div>
								<div className="px-1">
									<div className="text-xs font-medium text-gray-600 dark:text-gray-400">
										Cognitive
									</div>
									<div className="flex items-center justify-center space-x-1 mt-1">
										<span
											className="material-symbols-outlined  text-teal-500"
											style={{ fontSize: "16px", lineHeight: 1 }}
										>
											neurology
										</span>
										<span className="text-xs font-semibold">
											{progress.cognitive.percentage}%
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</CardContent>
		</Card>
	);
};

export default CompanyAssessmentProgress;
