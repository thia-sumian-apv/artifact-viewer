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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the props interface
interface SocDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	data: {
		status: string;
		minutes: number;
		seconds: number;
	};
	setData: React.Dispatch<
		React.SetStateAction<{
			status: string;
			minutes: number;
			seconds: number;
		}>
	>;
}

const SocDialog: React.FC<SocDialogProps> = ({
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
					<DialogTitle>Edit SOC Performance</DialogTitle>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					{/* Pass/Fail Status */}
					<div>
						<Label className="text-sm block mb-3">Status</Label>
						<RadioGroup
							value={data.status}
							onValueChange={(value) => setData({ ...data, status: value })}
							className="flex gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="pass" id="soc-pass" />
								<Label htmlFor="soc-pass" className="cursor-pointer">
									Pass
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="fail" id="soc-fail" />
								<Label htmlFor="soc-fail" className="cursor-pointer">
									Fail
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Completion Time with min/sec labels */}
					<div>
						<Label className="text-sm block mb-3">Completion Time</Label>
						<div className="flex items-center space-x-3">
							<div className="flex-1">
								<div className="flex items-center space-x-2">
									<Input
										type="number"
										min="0"
										placeholder="Minutes"
										value={data.minutes}
										onChange={(e) =>
											setData({
												...data,
												minutes: Number(e.target.value),
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
										value={data.seconds}
										onChange={(e) =>
											setData({
												...data,
												seconds: Number(e.target.value),
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

export default SocDialog;
