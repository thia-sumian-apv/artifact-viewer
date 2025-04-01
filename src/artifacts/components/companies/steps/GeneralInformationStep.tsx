import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface GeneralInformationStepProps {
	data: {
		name: string;
		shortName: string;
		status: "active" | "inactive";
		contactName: string;
		contactEmail: string;
		contactNumber: string;
		address: string;
	};
	onUpdate: (data: GeneralInformationStepProps["data"]) => void;
	onNext: () => void;
}

export default function GeneralInformationStep({
	data,
	onUpdate,
}: GeneralInformationStepProps) {
	return (
		<div className="space-y-5 px-1">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="companyName">Company Name</Label>
					<Input
						id="companyName"
						value={data.name}
						onChange={(e) => onUpdate({ ...data, name: e.target.value })}
						placeholder="Enter full legal name of the company"
						required
						className="focus-visible:ring-1"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="shortName">
						Abbreviation
						<span className="text-sm text-muted-foreground ml-1">
							(Optional)
						</span>
					</Label>
					<Input
						id="shortName"
						value={data.shortName}
						onChange={(e) => onUpdate({ ...data, shortName: e.target.value })}
						placeholder="Short form for reports"
						maxLength={10}
						className="focus-visible:ring-1"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="companyStatus">Company Status</Label>
					<div className="h-10 rounded-md bg-background px-3 flex items-center">
						<div className="flex items-center space-x-3">
							<Switch
								id="companyStatus"
								checked={data.status === "active"}
								onCheckedChange={(checked) =>
									onUpdate({
										...data,
										status: checked ? "active" : "inactive",
									})
								}
							/>
							<span
								className={`text-sm font-medium ${data.status === "active" ? "text-green-600" : "text-red-600"}`}
							>
								{data.status === "active" ? "Active" : "Inactive"}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="contactName">Contact Name</Label>
					<Input
						id="contactName"
						value={data.contactName}
						onChange={(e) => onUpdate({ ...data, contactName: e.target.value })}
						placeholder="Main point of contact"
						required
						className="focus-visible:ring-1"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="contactEmail">Contact Email</Label>
					<Input
						id="contactEmail"
						type="email"
						value={data.contactEmail}
						onChange={(e) =>
							onUpdate({ ...data, contactEmail: e.target.value })
						}
						placeholder="Email for primary contact"
						required
						className="focus-visible:ring-1"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="contactNumber">
						Contact Number
						<span className="text-sm text-muted-foreground ml-1">
							(Optional)
						</span>
					</Label>
					<Input
						id="contactNumber"
						value={data.contactNumber}
						onChange={(e) =>
							onUpdate({ ...data, contactNumber: e.target.value })
						}
						placeholder="+1 (123) 456-7890"
						className="focus-visible:ring-1"
					/>
				</div>
			</div>

			<div className="mt-4">
				<div className="space-y-2">
					<Label htmlFor="address">
						Company Address
						<span className="text-sm text-muted-foreground ml-1">
							(Optional)
						</span>
					</Label>
					<Input
						id="address"
						value={data.address}
						onChange={(e) => onUpdate({ ...data, address: e.target.value })}
						placeholder="Street address, city, postal code, country"
						className="focus-visible:ring-1"
					/>
				</div>
			</div>
		</div>
	);
}
