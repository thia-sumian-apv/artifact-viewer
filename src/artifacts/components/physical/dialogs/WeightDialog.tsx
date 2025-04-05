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
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FileX, Plus, X } from "lucide-react";

// Define the injury interface for type safety
interface Injury {
	id: string;
	injuryType: string;
	description: string;
	injuryDate: Date;
	status: string;
	recoveryDate?: Date;
}

// Define the props for the component
interface WeightDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	data: {
		weight: number;
		injuries: Injury[];
		newInjury: {
			injuryType: string;
			description: string;
			injuryDate: Date;
			status: string;
			recoveryDate?: Date;
		};
	};
}

const WeightDialog: React.FC<WeightDialogProps> = ({
	open,
	onClose,
	onSave,
	data,
}) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				{" "}
				{/* Increased max width */}
				<DialogHeader>
					<DialogTitle>Edit Weight & Injury History</DialogTitle>
				</DialogHeader>
				<div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto">
					{" "}
					{/* Weight section */}
					<div className="mb-6">
						<h3 className="text-sm font-medium mb-3">Current Weight</h3>
						<div className="flex items-center gap-4">
							<Label htmlFor="weight" className="whitespace-nowrap">
								Weight (kg)
							</Label>
							<div className="flex-grow max-w-xs">
								<Input
									id="weight"
									type="number"
									value={data.weight}
									onChange={() => null}
									className="w-full"
								/>
							</div>
						</div>
					</div>
					<Separator />
					{/* Existing injuries section */}
					<div>
						<div className="flex justify-between items-center mb-3">
							<h3 className="text-sm font-medium">Existing Injuries</h3>
						</div>

						{data.injuries.length === 0 ? (
							<Card className="flex items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900">
								<div>
									<FileX className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
									<p className="text-sm text-muted-foreground">
										No injuries recorded
									</p>
								</div>
							</Card>
						) : (
							<div className="space-y-4">
								{data.injuries.map((injury, index) => (
									<Card key={injury.id} className="p-4 shadow-sm">
										<div className="flex justify-between items-start mb-2">
											<div className="flex items-center gap-2">
												<h4 className="text-sm font-medium">
													{injury.injuryType}
												</h4>
											</div>

											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7"
												onClick={() => null}
											>
												<X className="h-4 w-4" />
												<span className="sr-only">Remove</span>
											</Button>
										</div>

										<div className="grid gap-4">
											{/* Row 1: Type and Status */}
											<div className="grid grid-cols-2 gap-4">
												<div>
													<Label
														htmlFor={`injury-type-${index}`}
														className="text-xs block mb-1"
													>
														Injury Type
													</Label>
													<Select
														value={injury.injuryType}
														onValueChange={() => null}
													>
														<SelectTrigger id={`injury-type-${index}`}>
															<SelectValue placeholder="Select type" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="Sprain">Sprain</SelectItem>
															<SelectItem value="Strain">Strain</SelectItem>
															<SelectItem value="Fracture">Fracture</SelectItem>
															<SelectItem value="Tendonitis">
																Tendonitis
															</SelectItem>
															<SelectItem value="Shin Splints">
																Shin Splints
															</SelectItem>
															<SelectItem value="Other">Other</SelectItem>
														</SelectContent>
													</Select>
												</div>

												<div>
													<Label
														htmlFor={`injury-status-${index}`}
														className="text-xs block mb-1"
													>
														Status
													</Label>
													<Select
														value={injury.status}
														onValueChange={() => null}
													>
														<SelectTrigger id={`injury-status-${index}`}>
															<SelectValue placeholder="Select status" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="active">Active</SelectItem>
															<SelectItem value="recovered">
																Recovered
															</SelectItem>
															<SelectItem value="chronic">Chronic</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>

											{/* Row 2: Description */}
											<div>
												<Label
													htmlFor={`injury-desc-${index}`}
													className="text-xs block mb-1"
												>
													Description
												</Label>
												<Textarea
													id={`injury-desc-${index}`}
													value={injury.description}
													onChange={() => null}
													placeholder="Describe the injury"
													className="resize-none h-[80px]"
												/>
											</div>

											{/* Row 3: Dates */}
											<div className="grid grid-cols-2 gap-4">
												<div>
													<Label className="text-xs block mb-1">
														Injury Date
													</Label>
													<Popover>
														<PopoverTrigger asChild>
															<Button
																variant="outline"
																className="w-full justify-start text-left font-normal"
															>
																<CalendarIcon className="mr-2 h-4 w-4" />
																{format(injury.injuryDate, "PPP")}
															</Button>
														</PopoverTrigger>
														<PopoverContent className="w-auto p-0">
															<Calendar
																mode="single"
																selected={injury.injuryDate}
																onSelect={() => null}
																initialFocus
															/>
														</PopoverContent>
													</Popover>
												</div>

												{injury.status === "recovered" && (
													<div>
														<Label className="text-xs block mb-1">
															Recovery Date
														</Label>
														<Popover>
															<PopoverTrigger asChild>
																<Button
																	variant="outline"
																	className="w-full justify-start text-left font-normal"
																>
																	<CalendarIcon className="mr-2 h-4 w-4" />
																	{injury.recoveryDate
																		? format(injury.recoveryDate, "PPP")
																		: "Select date"}
																</Button>
															</PopoverTrigger>
															<PopoverContent className="w-auto p-0">
																<Calendar
																	mode="single"
																	selected={injury.recoveryDate}
																	onSelect={() => null}
																	initialFocus
																	disabled={(date) =>
																		date < injury.injuryDate ||
																		date > new Date()
																	}
																/>
															</PopoverContent>
														</Popover>
													</div>
												)}
											</div>
										</div>
									</Card>
								))}
							</div>
						)}
					</div>
					<Separator className="my-4" />
					{/* Add new injury section */}
					<div>
						<h3 className="text-sm font-medium mb-3">Add New Injury</h3>
						<Card className="p-4 shadow-sm">
							<div className="grid gap-4">
								{/* Row 1: Type and Status */}
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label
											htmlFor="new-injury-type"
											className="text-xs block mb-1"
										>
											Injury Type
										</Label>
										<Select
											value={data.newInjury.injuryType}
											onValueChange={() => null}
										>
											<SelectTrigger id="new-injury-type">
												<SelectValue placeholder="Select type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Sprain">Sprain</SelectItem>
												<SelectItem value="Strain">Strain</SelectItem>
												<SelectItem value="Fracture">Fracture</SelectItem>
												<SelectItem value="Tendonitis">Tendonitis</SelectItem>
												<SelectItem value="Shin Splints">
													Shin Splints
												</SelectItem>
												<SelectItem value="Other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label
											htmlFor="new-injury-status"
											className="text-xs block mb-1"
										>
											Status
										</Label>
										<Select
											value={data.newInjury.status}
											onValueChange={() => null}
										>
											<SelectTrigger id="new-injury-status">
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="active">Active</SelectItem>
												<SelectItem value="recovered">Recovered</SelectItem>
												<SelectItem value="chronic">Chronic</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Row 2: Description */}
								<div>
									<Label
										htmlFor="new-injury-desc"
										className="text-xs block mb-1"
									>
										Description
									</Label>
									<Textarea
										id="new-injury-desc"
										value={data.newInjury.description}
										onChange={() => null}
										placeholder="Describe the injury (e.g., Ankle sprain during morning PT)"
										className="resize-none h-[80px]"
									/>
								</div>

								{/* Row 3: Dates */}
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-xs block mb-1">Injury Date</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal"
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{format(data.newInjury.injuryDate, "PPP")}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={data.newInjury.injuryDate}
													onSelect={() => null}
													initialFocus
													disabled={(date) => date > new Date()}
												/>
											</PopoverContent>
										</Popover>
									</div>

									{data.newInjury.status === "recovered" && (
										<div>
											<Label className="text-xs block mb-1">
												Recovery Date
											</Label>
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="w-full justify-start text-left font-normal"
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{data.newInjury.recoveryDate
															? format(data.newInjury.recoveryDate, "PPP")
															: "Select date"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={data.newInjury.recoveryDate}
														onSelect={() => null}
														initialFocus
														disabled={(date) =>
															date < data.newInjury.injuryDate ||
															date > new Date()
														}
													/>
												</PopoverContent>
											</Popover>
										</div>
									)}
								</div>
							</div>

							<Button
								className="w-full mt-4 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
								disabled={
									!data.newInjury.injuryType || !data.newInjury.description
								}
								onClick={() => null}
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Injury
							</Button>
						</Card>
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

export default WeightDialog;
