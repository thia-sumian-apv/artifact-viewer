import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Building2, Upload } from "lucide-react";

interface BasicCompanyInfoStepProps {
	data: {
		name: string;
		shortName: string;
		registrationNumber: string;
		logo: File | null;
		status: "active" | "inactive";
	};
	onUpdate: (data: BasicCompanyInfoStepProps["data"]) => void;
	onNext: () => void;
}

export default function BasicCompanyInfoStep({
	data,
	onUpdate,
}: BasicCompanyInfoStepProps) {
	const [logoPreview, setLogoPreview] = useState<string | null>(null);

	const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		if (file) {
			onUpdate({ ...data, logo: file });

			// Create a preview URL
			const reader = new FileReader();
			reader.onload = (event) => {
				setLogoPreview(event.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="space-y-4 px-1">
			<div className="space-y-2">
				<Label htmlFor="companyName">Company Name</Label>
				<Input
					id="companyName"
					value={data.name}
					onChange={(e) => onUpdate({ ...data, name: e.target.value })}
					placeholder="Enter full legal name of the company"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="shortName">Short Name/Abbreviation</Label>
					<Input
						id="shortName"
						value={data.shortName}
						onChange={(e) => onUpdate({ ...data, shortName: e.target.value })}
						placeholder="Short form for reports"
						maxLength={10}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="registrationNumber">Registration Number</Label>
					<Input
						id="registrationNumber"
						value={data.registrationNumber}
						onChange={(e) =>
							onUpdate({ ...data, registrationNumber: e.target.value })
						}
						placeholder="Registration/incorporation number"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="companyLogo">Company Logo</Label>
					<div className="flex items-start space-x-3">
						<div className="w-16 h-16 border rounded-md flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800">
							{logoPreview ? (
								<img
									src={logoPreview}
									alt="Logo preview"
									className="w-full h-full object-contain"
								/>
							) : (
								<Building2 className="h-8 w-8 text-gray-300 dark:text-gray-600" />
							)}
						</div>

						<div className="flex-1">
							<Input
								type="file"
								id="companyLogo"
								accept="image/*"
								className="hidden"
								onChange={handleLogoChange}
							/>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-full"
								onClick={() => document.getElementById("companyLogo")?.click()}
							>
								<Upload className="mr-2 h-3 w-3" />
								Upload Logo
							</Button>
							<p className="text-xs text-gray-500 mt-1">Max: 2MB, PNG/JPG</p>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="companyStatus">Company Status</Label>
					<Select
						value={data.status}
						onValueChange={(value: "active" | "inactive") =>
							onUpdate({ ...data, status: value })
						}
					>
						<SelectTrigger id="companyStatus">
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="inactive">Inactive</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
