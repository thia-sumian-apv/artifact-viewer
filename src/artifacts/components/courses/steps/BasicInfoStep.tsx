import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoStepProps {
	data: {
		courseCode: string;
		courseName: string;
		courseDescription: string;
	};
	onUpdate: (data: {
		courseCode: string;
		courseName: string;
		courseDescription: string;
	}) => void;
	onNext: () => void;
}

export function BasicInfoStep({ data, onUpdate }: BasicInfoStepProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<label htmlFor="courseCode" className="text-sm font-medium">
					Course Code
				</label>
				<Input
					id="courseCode"
					value={data.courseCode}
					onChange={(e) => onUpdate({ ...data, courseCode: e.target.value })}
					placeholder="Enter course code"
				/>
			</div>

			<div className="space-y-2">
				<label htmlFor="courseName" className="text-sm font-medium">
					Course Name
				</label>
				<Input
					id="courseName"
					value={data.courseName}
					onChange={(e) => onUpdate({ ...data, courseName: e.target.value })}
					placeholder="Enter course name"
				/>
			</div>

			<div className="space-y-2">
				<label htmlFor="courseDescription" className="text-sm font-medium">
					Course Description
				</label>
				<Textarea
					id="courseDescription"
					value={data.courseDescription}
					onChange={(e) =>
						onUpdate({ ...data, courseDescription: e.target.value })
					}
					placeholder="Enter course description"
				/>
			</div>
		</div>
	);
}
