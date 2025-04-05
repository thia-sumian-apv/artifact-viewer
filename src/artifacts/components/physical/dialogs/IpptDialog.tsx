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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Define the props interface
interface IpptDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	data: {
		pushUps: number;
		sitUps: number;
		runMinutes: number;
		runSeconds: number;
		award: string;
	};
	setData: React.Dispatch<
		React.SetStateAction<{
			pushUps: number;
			sitUps: number;
			runMinutes: number;
			runSeconds: number;
			award: string;
		}>
	>;
}

const IpptDialog: React.FC<IpptDialogProps> = ({
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
						Edit IPPT Results
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					{/* Award Selection */}
					<div className="mb-2">
						<Label className="text-sm mb-2 block">Award</Label>
						<Select
							value={data.award}
							onValueChange={(value) => setData({ ...data, award: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select award" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="gold">Gold</SelectItem>
								<SelectItem value="silver">Silver</SelectItem>
								<SelectItem value="bronze">Bronze</SelectItem>
								<SelectItem value="pass">Pass</SelectItem>
								<SelectItem value="fail">Fail</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Push-ups and Sit-ups (2 columns) */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="push-ups" className="text-sm block mb-2">
								Push-ups
							</Label>
							<Input
								id="push-ups"
								type="number"
								min="0"
								value={data.pushUps}
								onChange={(e) =>
									setData({
										...data,
										pushUps: Number(e.target.value),
									})
								}
							/>
						</div>

						<div>
							<Label htmlFor="sit-ups" className="text-sm block mb-2">
								Sit-ups
							</Label>
							<Input
								id="sit-ups"
								type="number"
								min="0"
								value={data.sitUps}
								onChange={(e) =>
									setData({
										...data,
										sitUps: Number(e.target.value),
									})
								}
							/>
						</div>
					</div>

					{/* Run Time */}
					<div>
						<Label className="text-sm block mb-2">Run Time</Label>
						<div className="flex items-center space-x-3">
							<div className="flex-1">
								<div className="flex items-center space-x-2">
									<Input
										type="number"
										min="0"
										placeholder="Minutes"
										value={data.runMinutes}
										onChange={(e) =>
											setData({
												...data,
												runMinutes: Number(e.target.value),
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
										value={data.runSeconds}
										onChange={(e) =>
											setData({
												...data,
												runSeconds: Number(e.target.value),
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

export default IpptDialog;
