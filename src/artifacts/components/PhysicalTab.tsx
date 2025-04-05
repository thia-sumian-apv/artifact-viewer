import { useState } from "react";
import {
	Activity,
	Award,
	HeartPulse,
	Scale,
	Timer,
	Weight,
} from "lucide-react";
import { format } from "date-fns";

import PhysicalCard, { DataRow, StatusBadge } from "./physical/PhysicalCard";
import { formatTimeFromSeconds } from "../mocks/physicalData";
import {
	mockInjuries,
	mockIPPTRecords,
	mockSOCRecords,
	mockRoadMarchRecords,
	mockCardioRecords,
	mockStrengthRecords,
} from "../mocks/physicalData";
import { mockUsers } from "../mocks/userData";
import WeightDialog from "./physical/dialogs/WeightDialog";
import IpptDialog from "./physical/dialogs/IpptDialog";
import SocDialog from "./physical/dialogs/SocDialog";
import RoadMarchDialog from "./physical/dialogs/RoadMarchDialog";
import CardioDialog from "./physical/dialogs/CardioDialog";
import StrengthDialog from "./physical/dialogs/StrengthDialog";

// For demo, we'll use a specific user's data (trainee)
const USER_ID = "user-008"; // Thomas Garcia

const PhysicalTab = () => {
	const [activeDialog, setActiveDialog] = useState<string | null>(null);

	// Form state for each edit dialog
	const [weightData, setWeightData] = useState({
		weight: 0,
		injuries: [] as {
			id: string;
			injuryType: string;
			description: string;
			injuryDate: Date;
			status: string;
			recoveryDate?: Date;
		}[],
		newInjury: {
			injuryType: "",
			description: "",
			injuryDate: new Date(),
			status: "active", // Default status
			recoveryDate: undefined as Date | undefined,
		},
	});
	const [ipptData, setIpptData] = useState({
		pushUps: 0,
		sitUps: 0,
		runMinutes: 0,
		runSeconds: 0,
		award: "",
	});
	const [socData, setSOCData] = useState({
		status: "",
		minutes: 0,
		seconds: 0,
	});
	const [roadMarchData, setRoadMarchData] = useState({
		status: "",
		distance: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [cardioData, setCardioData] = useState({
		vo2Max: 0,
		restingHR: 0,
		exerciseHR: 0,
		hrVariability: 0,
	});
	const [strengthData, setStrengthData] = useState({
		squatMax: 0,
		deadliftMax: 0,
		pullUps: 0,
		sprintDragMinutes: 0,
		sprintDragSeconds: 0,
	});

	// Find user data
	const user = mockUsers.find((user) => user.id === USER_ID);

	// Find latest records for this user
	const injuries = mockInjuries.filter((injury) => injury.userId === USER_ID);
	const latestIPPT = mockIPPTRecords
		.filter((record) => record.userId === USER_ID)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
	const latestSOC = mockSOCRecords
		.filter((record) => record.userId === USER_ID)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
	const latestRoadMarch = mockRoadMarchRecords
		.filter((record) => record.userId === USER_ID)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
	const latestCardio = mockCardioRecords
		.filter((record) => record.userId === USER_ID)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];
	const latestStrength = mockStrengthRecords
		.filter((record) => record.userId === USER_ID)
		.sort((a, b) => b.assessmentDate.getTime() - a.assessmentDate.getTime())[0];

	const handleOpenDialog = (dialogType: string) => {
		// Initialize form data based on current values when opening dialog
		if (dialogType === "Weight") {
			setWeightData({
				weight: user?.weight || 0,
				injuries: [...injuries], // Clone the injuries array
				newInjury: {
					injuryType: "",
					description: "",
					injuryDate: new Date(),
					status: "active",
					recoveryDate: undefined,
				},
			});
		} else if (dialogType === "Ippt" && latestIPPT) {
			const minutes = Math.floor(latestIPPT.runTime / 60);
			const seconds = latestIPPT.runTime % 60;
			setIpptData({
				pushUps: latestIPPT.pushUpReps,
				sitUps: latestIPPT.sitUpReps,
				runMinutes: minutes,
				runSeconds: seconds,
				award: latestIPPT.award,
			});
		} else if (dialogType === "Soc" && latestSOC) {
			const minutes = Math.floor(latestSOC.timeInSeconds / 60);
			const seconds = latestSOC.timeInSeconds % 60;
			setSOCData({
				status: latestSOC.status,
				minutes,
				seconds,
			});
		} else if (dialogType === "RoadMarch" && latestRoadMarch) {
			const hours = Math.floor(latestRoadMarch.timeInSeconds / 3600);
			const minutes = Math.floor((latestRoadMarch.timeInSeconds % 3600) / 60);
			const seconds = latestRoadMarch.timeInSeconds % 60;
			setRoadMarchData({
				status: latestRoadMarch.status,
				distance: latestRoadMarch.distanceCompleted,
				hours,
				minutes,
				seconds,
			});
		} else if (dialogType === "Cardio" && latestCardio) {
			setCardioData({
				vo2Max: latestCardio.vo2Max,
				restingHR: latestCardio.restingHeartRate,
				exerciseHR: latestCardio.exerciseHeartRate,
				hrVariability: latestCardio.heartRateVariability,
			});
		} else if (dialogType === "Strength" && latestStrength) {
			const minutes = Math.floor(latestStrength.sprintDragCarryTime / 60);
			const seconds = latestStrength.sprintDragCarryTime % 60;
			setStrengthData({
				squatMax: latestStrength.squatRepMax,
				deadliftMax: latestStrength.deadliftRepMax,
				pullUps: latestStrength.maxPullUps,
				sprintDragMinutes: minutes,
				sprintDragSeconds: seconds,
			});
		}

		setActiveDialog(dialogType);
	};

	const handleCloseDialog = () => {
		setActiveDialog(null);
	};

	const handleSaveData = () => {
		// Here you would implement the actual data saving logic
		// For now we'll just log and close the dialog
		console.log("Saving data:", {
			activeDialog,
			weightData,
			ipptData,
			socData,
			roadMarchData,
			cardioData,
			strengthData,
		});
		handleCloseDialog();
	};

	// Format date for display
	const formatDate = (date: Date) => {
		return format(date, "d MMM yyyy");
	};

	return (
		<>
			<h2 className="text-lg font-medium mb-4">Physical Assessment Data</h2>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{/* Weight and Injury Card */}
				<PhysicalCard
					title="Weight & Injury History"
					description={`Current Weight: ${user?.weight} kg`}
					icon={<Scale className="h-6 w-6" />}
					date={
						injuries.length > 0 ? formatDate(injuries[0].updatedAt) : undefined
					}
					onEditData={() => handleOpenDialog("Weight")}
				>
					<div className="space-y-2">
						<h4 className="text-xs font-medium mb-1">Injury History:</h4>
						{injuries.length > 0 ? (
							<div className="text-xs text-muted-foreground">
								{injuries.length} recorded{" "}
								{injuries.length === 1 ? "injury" : "injuries"}
							</div>
						) : (
							<div className="text-xs text-muted-foreground">
								No injuries recorded
							</div>
						)}
					</div>
				</PhysicalCard>

				{/* IPPT Card */}
				<PhysicalCard
					title="IPPT Results"
					icon={<Award className="h-6 w-6" />}
					date={latestIPPT ? formatDate(latestIPPT.assessmentDate) : undefined}
					onEditData={() => handleOpenDialog("Ippt")}
				>
					{latestIPPT ? (
						<div className="space-y-2">
							<div className="flex justify-between items-center mb-2">
								<span className="text-xs font-medium">Award:</span>
								<StatusBadge
									status={
										latestIPPT.award.charAt(0).toUpperCase() +
										latestIPPT.award.slice(1)
									}
									variant={
										latestIPPT.award as "gold" | "silver" | "bronze" | "default"
									}
								/>
							</div>
							<DataRow
								label="Push-ups:"
								value={`${latestIPPT.pushUpReps} reps`}
							/>
							<DataRow
								label="Sit-ups:"
								value={`${latestIPPT.sitUpReps} reps`}
							/>
							<DataRow
								label="Run Time:"
								value={formatTimeFromSeconds(latestIPPT.runTime)}
							/>
							<DataRow
								label="Total Score:"
								value={`${latestIPPT.totalScore}/100`}
							/>
						</div>
					) : (
						<div className="text-xs text-muted-foreground">
							No IPPT data available
						</div>
					)}
				</PhysicalCard>

				{/* SOC Card */}
				<PhysicalCard
					title="SOC Performance"
					icon={<Timer className="h-6 w-6" />}
					date={latestSOC ? formatDate(latestSOC.assessmentDate) : undefined}
					onEditData={() => handleOpenDialog("Soc")}
				>
					{latestSOC ? (
						<div className="space-y-2">
							<div className="flex justify-between items-center mb-2">
								<span className="text-xs font-medium">Status:</span>
								<StatusBadge
									status={latestSOC.status === "pass" ? "Pass" : "Fail"}
									variant={latestSOC.status === "pass" ? "success" : "danger"}
								/>
							</div>
							<DataRow
								label="Completion Time:"
								value={formatTimeFromSeconds(latestSOC.timeInSeconds)}
							/>
						</div>
					) : (
						<div className="text-xs text-muted-foreground">
							No SOC data available
						</div>
					)}
				</PhysicalCard>

				{/* Road March Card */}
				<PhysicalCard
					title="20km Road March"
					icon={<Activity className="h-6 w-6" />}
					date={
						latestRoadMarch
							? formatDate(latestRoadMarch.assessmentDate)
							: undefined
					}
					onEditData={() => handleOpenDialog("RoadMarch")}
				>
					{latestRoadMarch ? (
						<div className="space-y-2">
							<div className="flex justify-between items-center mb-2">
								<span className="text-xs font-medium">Status:</span>
								<StatusBadge
									status={latestRoadMarch.status === "pass" ? "Pass" : "Fail"}
									variant={
										latestRoadMarch.status === "pass" ? "success" : "danger"
									}
								/>
							</div>
							<DataRow
								label="Distance:"
								value={`${latestRoadMarch.distanceCompleted} km`}
							/>
							<DataRow
								label="Completion Time:"
								value={formatTimeFromSeconds(latestRoadMarch.timeInSeconds)}
							/>
						</div>
					) : (
						<div className="text-xs text-muted-foreground">
							No road march data available
						</div>
					)}
				</PhysicalCard>

				{/* Cardio Card */}
				<PhysicalCard
					title="Cardio Respiratory"
					icon={<HeartPulse className="h-6 w-6" />}
					date={
						latestCardio ? formatDate(latestCardio.assessmentDate) : undefined
					}
					onEditData={() => handleOpenDialog("Cardio")}
				>
					{latestCardio ? (
						<div className="space-y-2">
							<DataRow
								label="VO2 Max:"
								value={`${latestCardio.vo2Max} ml/kg/min`}
							/>
							<DataRow
								label="Resting HR:"
								value={`${latestCardio.restingHeartRate} bpm`}
							/>
							<DataRow
								label="Exercise HR:"
								value={`${latestCardio.exerciseHeartRate} bpm`}
							/>
							<DataRow
								label="HR Variability:"
								value={`${latestCardio.heartRateVariability} ms`}
							/>
						</div>
					) : (
						<div className="text-xs text-muted-foreground">
							No cardio data available
						</div>
					)}
				</PhysicalCard>

				{/* Strength Card */}
				<PhysicalCard
					title="Strength Assessment"
					icon={<Weight className="h-6 w-6" />}
					date={
						latestStrength
							? formatDate(latestStrength.assessmentDate)
							: undefined
					}
					onEditData={() => handleOpenDialog("Strength")}
				>
					{latestStrength ? (
						<div className="space-y-2">
							<DataRow
								label="Squat Rep Max:"
								value={`${latestStrength.squatRepMax} kg`}
							/>
							<DataRow
								label="Deadlift Rep Max:"
								value={`${latestStrength.deadliftRepMax} kg`}
							/>
							<DataRow
								label="Max Pull-ups:"
								value={`${latestStrength.maxPullUps} reps`}
							/>
							<DataRow
								label="Sprint Drag Carry:"
								value={formatTimeFromSeconds(
									latestStrength.sprintDragCarryTime,
								)}
							/>
						</div>
					) : (
						<div className="text-xs text-muted-foreground">
							No strength data available
						</div>
					)}
				</PhysicalCard>
			</div>

			{/* Instead of inline dialogs, use the extracted components */}
			<WeightDialog
				open={activeDialog === "Weight"}
				onClose={handleCloseDialog}
				onSave={handleSaveData}
				data={weightData}
			/>

			<IpptDialog
				open={activeDialog === "Ippt"}
				onClose={handleCloseDialog}
				onSave={handleSaveData}
				data={ipptData}
				setData={setIpptData}
			/>

			<SocDialog
				open={activeDialog === "Soc"}
				onClose={handleCloseDialog}
				onSave={handleSaveData}
				data={socData}
				setData={setSOCData}
			/>

			<RoadMarchDialog
				open={activeDialog === "RoadMarch"}
				onClose={handleCloseDialog}
				onSave={handleSaveData}
				data={roadMarchData}
				setData={setRoadMarchData}
			/>

			<CardioDialog
				open={activeDialog === "Cardio"}
				onClose={handleCloseDialog}
				onSave={handleSaveData}
				data={cardioData}
				setData={setCardioData}
			/>

			<StrengthDialog
				open={activeDialog === "Strength"}
				onClose={handleCloseDialog}
				onSave={handleSaveData}
				data={strengthData}
				setData={setStrengthData}
			/>
		</>
	);
};

export default PhysicalTab;
