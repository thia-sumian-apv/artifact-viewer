import { Clock, Edit } from "lucide-react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

export interface PhysicalCardProps {
	title: string;
	description?: string;
	date?: string;
	icon?: ReactNode;
	children: ReactNode;
	onEditData?: () => void;
}

const PhysicalCard = ({
	title,
	description,
	date,
	icon,
	children,
	onEditData,
}: PhysicalCardProps) => {
	return (
		<Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full overflow-hidden">
			<CardHeader className="p-4 space-y-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center flex-1 min-w-0 pr-2">
						<div className="flex-shrink-0 bg-teal-50 dark:bg-teal-900/30 rounded-lg p-2">
							<div className="text-teal-600 dark:text-teal-400">{icon}</div>
						</div>
						<div className="ml-3 flex-1 min-w-0">
							<h3 className="text-base font-medium">{title}</h3>
							{description && (
								<p className="text-xs text-muted-foreground">{description}</p>
							)}
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent className="px-4 py-3 flex-1">
				{children}

				{date && (
					<div className="flex items-center text-xs text-muted-foreground mt-3">
						<Clock className="flex-shrink-0 h-3 w-3 text-muted-foreground mr-1" />
						<span>Last Updated: {date}</span>
					</div>
				)}
			</CardContent>

			{onEditData && (
				<CardFooter className="p-4 pt-2">
					<Button
						variant="default"
						className="w-full"
						onClick={onEditData}
						size="sm"
					>
						<Edit className="h-3.5 w-3.5 mr-1" />
						Edit Data
					</Button>
				</CardFooter>
			)}
		</Card>
	);
};

export default PhysicalCard;

// Helper components for consistent styling within PhysicalCard
export const DataLabel = ({ children }: { children: ReactNode }) => (
	<span className="text-xs text-muted-foreground">{children}</span>
);

export const DataValue = ({ children }: { children: ReactNode }) => (
	<span className="text-xs font-medium">{children}</span>
);

export const DataRow = ({
	label,
	value,
}: { label: string; value: ReactNode }) => (
	<div className="flex justify-between items-center py-1">
		<DataLabel>{label}</DataLabel>
		<DataValue>{value}</DataValue>
	</div>
);

export const StatusBadge = ({
	status,
	variant,
}: {
	status: string;
	variant?:
		| "default"
		| "success"
		| "warning"
		| "danger"
		| "gold"
		| "silver"
		| "bronze";
}) => {
	const variantClasses = {
		default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
		success:
			"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
		warning:
			"bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
		danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
		gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
		silver: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
		bronze: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
	};

	const variantClass = variant
		? variantClasses[variant]
		: variantClasses.default;

	return (
		<Badge
			variant="outline"
			className={`text-xs font-medium px-2 py-0.5 rounded-full ${variantClass}`}
		>
			{status}
		</Badge>
	);
};
