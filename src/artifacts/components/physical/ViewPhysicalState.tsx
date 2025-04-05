import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { UserPhysicalProfile } from "../../types/physical";
import { formatTimeFromSeconds } from "../../mocks/physicalData";
import { mockCompanyData } from "../../mocks/companyData";
import { mockSubcohorts } from "../../mocks/cohortData";

interface ViewPhysicalStatsDialogProps {
	profile: UserPhysicalProfile | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ViewPhysicalStatsDialog({
	profile,
	open,
	onOpenChange,
}: ViewPhysicalStatsDialogProps) {
	if (!profile) return null;

	const user = profile.user;
	const subcohort =
		"subcohortId" in user && user.subcohortId
			? mockSubcohorts.find((s) => s.id === user.subcohortId)
			: null;

	const company =
		"companyId" in user && user.companyId
			? mockCompanyData.find((c) => c.id === user.companyId)
			: null;

	// Format IPPT award for display
	const formatIPPTAward = (award: string) => {
		switch (award) {
			case "gold":
				return (
					<Badge
						variant="default"
						className="bg-yellow-500 hover:bg-yellow-600"
					>
						Gold
					</Badge>
				);
			case "silver":
				return (
					<Badge variant="default" className="bg-gray-400 hover:bg-gray-500">
						Silver
					</Badge>
				);
			case "bronze":
				return (
					<Badge variant="default" className="bg-amber-700 hover:bg-amber-800">
						Bronze
					</Badge>
				);
			case "fail":
				return <Badge variant="destructive">Fail</Badge>;
			default:
				return <Badge variant="outline">None</Badge>;
		}
	};

	// Format pass/fail status for display
	const formatPassFailStatus = (status: string) => {
		if (status === "pass") {
			return (
				<Badge variant="default" className="bg-green-500 hover:bg-green-600">
					Pass
				</Badge>
			);
		}
		return <Badge variant="destructive">Fail</Badge>;
	};

	// Format injury severity for display
	const formatInjurySeverity = (severity: string) => {
		switch (severity) {
			case "severe":
				return <Badge variant="destructive">Severe</Badge>;
			case "moderate":
				return (
					<Badge
						variant="default"
						className="bg-yellow-500 hover:bg-yellow-600"
					>
						Moderate
					</Badge>
				);
			case "minor":
				return (
					<Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
						Minor
					</Badge>
				);
			default:
				return <Badge variant="outline">Unknown</Badge>;
		}
	};

	// Format injury status for display
	const formatInjuryStatus = (status: string) => {
		switch (status) {
			case "active":
				return <Badge variant="destructive">Active</Badge>;
			case "chronic":
				return (
					<Badge
						variant="default"
						className="bg-yellow-500 hover:bg-yellow-600"
					>
						Chronic
					</Badge>
				);
			case "recovered":
				return (
					<Badge variant="default" className="bg-green-500 hover:bg-green-600">
						Recovered
					</Badge>
				);
			default:
				return <Badge variant="outline">Unknown</Badge>;
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						Physical Stats: {user.firstName} {user.lastName}
					</DialogTitle>
					<DialogDescription>
						Detailed physical assessment data for this user.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-2 grid grid-cols-3 gap-4 mb-4">
					<div className="space-y-1">
						<div className="text-xs font-medium text-muted-foreground">
							Name
						</div>
						<div className="text-sm">
							{user.firstName} {user.lastName}
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-medium text-muted-foreground">
							Email
						</div>
						<div className="text-sm truncate">{user.email}</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-medium text-muted-foreground">
							Company
						</div>
						<div className="text-sm">{company ? company.name : "System"}</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-medium text-muted-foreground">
							Subcohort
						</div>
						<div className="text-sm">{subcohort ? subcohort.name : "N/A"}</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-medium text-muted-foreground">
							Weight
						</div>
						<div className="text-sm">{profile.weight} kg</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-medium text-muted-foreground">
							Height
						</div>
						<div className="text-sm">{user.height} cm</div>
					</div>
				</div>

				<Tabs defaultValue="ippt" className="w-full">
					<TabsList className="grid grid-cols-6 mb-4">
						<TabsTrigger value="ippt">IPPT</TabsTrigger>
						<TabsTrigger value="soc">SOC</TabsTrigger>
						<TabsTrigger value="roadmarch">Road March</TabsTrigger>
						<TabsTrigger value="cardio">Cardio</TabsTrigger>
						<TabsTrigger value="strength">Strength</TabsTrigger>
						<TabsTrigger value="injuries">Injuries</TabsTrigger>
					</TabsList>

					{/* IPPT Tab */}
					<TabsContent value="ippt" className="space-y-4">
						{profile.ipptRecords.length === 0 ? (
							<div className="text-center py-6 text-muted-foreground">
								No IPPT records available
							</div>
						) : (
							<div className="space-y-3">
								{profile.ipptRecords.map((record) => (
									<div
										key={record.id}
										className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
									>
										<div className="flex justify-between items-center mb-2">
											<div className="text-sm font-medium">
												{new Date(record.assessmentDate).toLocaleDateString()}
											</div>
											<div>{formatIPPTAward(record.award)}</div>
										</div>

										<div className="grid grid-cols-4 gap-2 text-sm">
											<div className="flex flex-col">
												<span className="text-xs text-muted-foreground">
													Push-ups
												</span>
												<span>{record.pushUpReps} reps</span>
											</div>
											<div className="flex flex-col">
												<span className="text-xs text-muted-foreground">
													Sit-ups
												</span>
												<span>{record.sitUpReps} reps</span>
											</div>
											<div className="flex flex-col">
												<span className="text-xs text-muted-foreground">
													2.4km Run
												</span>
												<span>{formatTimeFromSeconds(record.runTime)}</span>
											</div>
											<div className="flex flex-col">
												<span className="text-xs text-muted-foreground">
													Total Score
												</span>
												<span className="font-medium">
													{record.totalScore} pts
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</TabsContent>

					{/* SOC Tab */}
					<TabsContent value="soc" className="space-y-4">
						{profile.socRecords.length === 0 ? (
							<div className="text-center py-6 text-muted-foreground">
								No SOC records available
							</div>
						) : (
							<div className="space-y-3">
								{profile.socRecords.map((record) => (
									<div
										key={record.id}
										className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
									>
										<div className="flex justify-between items-center">
											<div className="text-sm font-medium">
												{new Date(record.assessmentDate).toLocaleDateString()}
											</div>
											<div className="flex items-center gap-2">
												<div className="text-xs text-muted-foreground">
													Completion Time:
												</div>
												<div className="font-medium">
													{formatTimeFromSeconds(record.timeInSeconds)}
												</div>
												{formatPassFailStatus(record.status)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</TabsContent>

					{/* Road March Tab */}
					<TabsContent value="roadmarch" className="space-y-4">
						{profile.roadMarchRecords.length === 0 ? (
							<div className="text-center py-6 text-muted-foreground">
								No Road March records available
							</div>
						) : (
							<div className="space-y-3">
								{profile.roadMarchRecords.map((record) => (
									<div
										key={record.id}
										className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
									>
										<div className="flex justify-between items-center">
											<div className="text-sm font-medium">
												{new Date(record.assessmentDate).toLocaleDateString()}
											</div>
											<div>{formatPassFailStatus(record.status)}</div>
										</div>

										<div className="mt-2 flex gap-4 text-sm">
											<div className="flex items-center gap-1">
												<span className="text-xs text-muted-foreground">
													Distance:
												</span>
												<span>{record.distanceCompleted} km</span>
											</div>
											<div className="flex items-center gap-1">
												<span className="text-xs text-muted-foreground">
													Time:
												</span>
												<span className="font-medium">
													{formatTimeFromSeconds(record.timeInSeconds)}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</TabsContent>

					{/* Cardio Tab */}
					<TabsContent value="cardio" className="space-y-4">
						{profile.cardioRecords.length === 0 ? (
							<div className="text-center py-6 text-muted-foreground">
								No Cardio Respiratory records available
							</div>
						) : (
							<div className="space-y-3">
								{profile.cardioRecords.map((record) => (
									<div
										key={record.id}
										className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
									>
										<div className="text-sm font-medium mb-2">
											{new Date(record.assessmentDate).toLocaleDateString()}
										</div>

										<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">VO2 Max:</span>
												<span>{record.vo2Max.toFixed(1)} ml/kg/min</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Resting HR:
												</span>
												<span>{record.restingHeartRate} BPM</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Exercise HR:
												</span>
												<span>{record.exerciseHeartRate} BPM</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													HR Variability:
												</span>
												<span>{record.heartRateVariability} ms</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</TabsContent>

					{/* Strength Tab */}
					<TabsContent value="strength" className="space-y-4">
						{profile.strengthRecords.length === 0 ? (
							<div className="text-center py-6 text-muted-foreground">
								No Strength records available
							</div>
						) : (
							<div className="space-y-3">
								{profile.strengthRecords.map((record) => (
									<div
										key={record.id}
										className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
									>
										<div className="text-sm font-medium mb-2">
											{new Date(record.assessmentDate).toLocaleDateString()}
										</div>

										<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Squat Rep Max:
												</span>
												<span>{record.squatRepMax} kg</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Deadlift Rep Max:
												</span>
												<span>{record.deadliftRepMax} kg</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Max Pull-ups:
												</span>
												<span>{record.maxPullUps} reps</span>
											</div>
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Sprint-Drag-Carry:
												</span>
												<span>
													{formatTimeFromSeconds(record.sprintDragCarryTime)}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</TabsContent>

					{/* Injuries Tab */}
					<TabsContent value="injuries" className="space-y-4">
						{profile.injuries.length === 0 ? (
							<div className="text-center py-6 text-muted-foreground">
								No injury records available
							</div>
						) : (
							<div className="space-y-3">
								{profile.injuries.map((injury) => (
									<div
										key={injury.id}
										className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
									>
										<div className="flex justify-between items-start mb-2">
											<div>
												<div className="font-medium text-sm">
													{injury.injuryType}
												</div>
												<div className="text-xs text-muted-foreground">
													{new Date(injury.injuryDate).toLocaleDateString()}
													{injury.recoveryDate &&
														` - ${new Date(injury.recoveryDate).toLocaleDateString()}`}
												</div>
											</div>
											<div className="flex gap-2">
												{formatInjurySeverity(injury.severity)}
												{formatInjuryStatus(injury.status)}
											</div>
										</div>
										<div className="text-sm mt-1">{injury.description}</div>
									</div>
								))}
							</div>
						)}
					</TabsContent>
				</Tabs>

				<div className="mt-4 flex justify-end">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
