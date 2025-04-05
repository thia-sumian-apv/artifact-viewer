import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the props interface
interface StrengthDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	data: {
		squatMax: number;
		deadliftMax: number;
		pullUps: number;
		sprintDragMinutes: number;
		sprintDragSeconds: number;
	};
	setData: React.Dispatch<
		React.SetStateAction<{
			squatMax: number;
			deadliftMax: number;
			pullUps: number;
			sprintDragMinutes: number;
			sprintDragSeconds: number;
		}>
	>;
}

const StrengthDialog: React.FC<StrengthDialogProps> = ({
	open,
	onClose,
	onSave,
	data,
	setData,
}) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						Edit Strength Assessment
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-5 py-4">
					{/* Two columns layout for desktop */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{/* Squat Rep Max */}
						<div>
							<Label
								htmlFor="squat-max"
								className="flex items-baseline gap-1 mb-2"
							>
								<span>Squat Rep Max</span>
								<span className="text-xs text-muted-foreground">(kg)</span>
							</Label>
							<Input
								id="squat-max"
								type="number"
								min="0"
								step="0.5"
								value={data.squatMax}
								onChange={(e) =>
									setData({
										...data,
										squatMax: Number(e.target.value),
									})
								}
							/>
						</div>

						{/* Deadlift Rep Max */}
						<div>
							<Label
								htmlFor="deadlift-max"
								className="flex items-baseline gap-1 mb-2"
							>
								<span>Deadlift Rep Max</span>
								<span className="text-xs text-muted-foreground">(kg)</span>
							</Label>
							<Input
								id="deadlift-max"
								type="number"
								min="0"
								step="0.5"
								value={data.deadliftMax}
								onChange={(e) =>
									setData({
										...data,
										deadliftMax: Number(e.target.value),
									})
								}
							/>
						</div>

						{/* Pull-Ups */}
						<div>
							<Label
								htmlFor="pull-ups"
								className="flex items-baseline gap-1 mb-2"
							>
								<span>Max Pull-ups</span>
								<span className="text-xs text-muted-foreground">(reps)</span>
							</Label>
							<Input
								id="pull-ups"
								type="number"
								min="0"
								value={data.pullUps}
								onChange={(e) =>
									setData({
										...data,
										pullUps: Number(e.target.value),
									})
								}
							/>
						</div>
					</div>

					{/* Sprint Drag Carry Time */}
					<div>
						<Label className="block mb-2">
							<span>Sprint-Drag-Carry Time</span>
						</Label>
						<div className="flex items-center space-x-3">
							<div className="flex-1">
								<div className="flex items-center space-x-2">
									<Input
										type="number"
										min="0"
										placeholder="Minutes"
										value={data.sprintDragMinutes}
										onChange={(e) =>
											setData({
												...data,
												sprintDragMinutes: Number(e.target.value),
											})
										}
										className="text-center"
									/>
									<span className="text-sm text-muted-foreground">min</span>
								</div>
							</div>

							<span className="text-lg">:</span>

							<div className="flex-1">
								<div className="flex items-center space-x-2">
									<Input
										type="number"
										min="0"
										max="59"
										placeholder="Seconds"
										value={data.sprintDragSeconds}
										onChange={(e) =>
											setData({
												...data,
												sprintDragSeconds: Number(e.target.value),
											})
										}
										className="text-center"
									/>
									<span className="text-sm text-muted-foreground">sec</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={onSave}>Save Changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default StrengthDialog;
