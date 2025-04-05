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
interface CardioDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	data: {
		vo2Max: number;
		restingHR: number;
		exerciseHR: number;
		hrVariability: number;
	};
	setData: React.Dispatch<
		React.SetStateAction<{
			vo2Max: number;
			restingHR: number;
			exerciseHR: number;
			hrVariability: number;
		}>
	>;
}

const CardioDialog: React.FC<CardioDialogProps> = ({
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
						Edit Cardio Respiratory Data
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-5 py-4">
					{/* Two columns layout for desktop */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{/* VO2 Max */}
						<div>
							<Label
								htmlFor="vo2max"
								className="flex items-baseline gap-1 mb-2"
							>
								<span>VO2 Max</span>
								<span className="text-xs text-muted-foreground">
									(ml/kg/min)
								</span>
							</Label>
							<Input
								id="vo2max"
								type="number"
								step="0.1"
								min="0"
								value={data.vo2Max}
								onChange={(e) =>
									setData({
										...data,
										vo2Max: Number(e.target.value),
									})
								}
							/>
						</div>

						{/* Resting Heart Rate */}
						<div>
							<Label
								htmlFor="resting-hr"
								className="flex items-baseline gap-1 mb-2"
							>
								<span>Resting Heart Rate</span>
								<span className="text-xs text-muted-foreground">(bpm)</span>
							</Label>
							<Input
								id="resting-hr"
								type="number"
								min="0"
								value={data.restingHR}
								onChange={(e) =>
									setData({
										...data,
										restingHR: Number(e.target.value),
									})
								}
							/>
						</div>

						{/* Exercise Heart Rate */}
						<div>
							<Label
								htmlFor="exercise-hr"
								className="flex items-baseline gap-1 mb-2"
							>
								<span>Exercise Heart Rate</span>
								<span className="text-xs text-muted-foreground">(bpm)</span>
							</Label>
							<Input
								id="exercise-hr"
								type="number"
								min="0"
								value={data.exerciseHR}
								onChange={(e) =>
									setData({
										...data,
										exerciseHR: Number(e.target.value),
									})
								}
							/>
						</div>

						{/* Heart Rate Variability */}
						<div>
							<Label
								htmlFor="hr-variability"
								className="flex items-baseline gap-1 mb-2"
							>
								<span>Heart Rate Variability</span>
								<span className="text-xs text-muted-foreground">(ms)</span>
							</Label>
							<Input
								id="hr-variability"
								type="number"
								min="0"
								value={data.hrVariability}
								onChange={(e) =>
									setData({
										...data,
										hrVariability: Number(e.target.value),
									})
								}
							/>
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

export default CardioDialog;
