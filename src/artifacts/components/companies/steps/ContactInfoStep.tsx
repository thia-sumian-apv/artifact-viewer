import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

interface ContactInfoStepProps {
	data: {
		contactName: string;
		contactEmail: string;
		contactNumber: string;
		address: string;
	};
	onUpdate: (data: ContactInfoStepProps["data"]) => void;
	onNext: () => void;
	onBack: () => void;
}

export default function ContactInfoStep({
	data,
	onUpdate,
}: ContactInfoStepProps) {
	// Basic validation
	const emailSchema = z.string().email("Invalid email format");
	const [emailError, setEmailError] = useState<string | null>(null);

	// Use a function for validation instead of validating in the component body
	const validateEmail = (email: string) => {
		try {
			emailSchema.parse(email);
			setEmailError(null);
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				setEmailError(error.errors[0].message);
			}
			return false;
		}
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = e.target.value;
		onUpdate({ ...data, contactEmail: newEmail });
		// Only validate if there's actually an email value
		if (newEmail) {
			validateEmail(newEmail);
		} else {
			setEmailError(null);
		}
	};

	return (
		<div className="space-y-4 px-1">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="contactName">Contact Name</Label>
					<Input
						id="contactName"
						value={data.contactName}
						onChange={(e) => onUpdate({ ...data, contactName: e.target.value })}
						placeholder="Enter main point of contact"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="contactNumber">Contact Number</Label>
					<Input
						id="contactNumber"
						value={data.contactNumber}
						onChange={(e) =>
							onUpdate({ ...data, contactNumber: e.target.value })
						}
						placeholder="Enter country code followed by contact number"
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="contactEmail">Contact Email</Label>
				<Input
					id="contactEmail"
					type="email"
					value={data.contactEmail}
					onChange={handleEmailChange}
					placeholder="Enter email for primary contact"
					className={emailError ? "border-red-500" : ""}
				/>
				{emailError && <p className="text-xs text-red-500">{emailError}</p>}
			</div>
			<div className="space-y-2">
				<Label htmlFor="companyAddress">Company Address</Label>
				<Textarea
					id="companyAddress"
					value={data.address}
					onChange={(e) => onUpdate({ ...data, address: e.target.value })}
					placeholder="Enter street address, city, postal code, country"
					rows={3}
				/>
			</div>
		</div>
	);
}
