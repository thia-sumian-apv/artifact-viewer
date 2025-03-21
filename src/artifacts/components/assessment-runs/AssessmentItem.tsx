import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Assessment } from "@/artifacts/types/assessment";

interface AssessmentItemProps {
	assessment: Assessment;
	isDraggable?: boolean;
	isCompact?: boolean;
}

const AssessmentItem = ({
	assessment,
	isDraggable = true,
	isCompact = false,
}: AssessmentItemProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: assessment.id,
		disabled: !isDraggable,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const getIcon = () => {
		switch (assessment.type) {
			case "cognitive":
				return <Brain className="h-4 w-4 mr-2" />;
			case "psychological":
				return <Activity className="h-4 w-4 mr-2" />;
			default:
				return null;
		}
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			{...(isDraggable ? { ...attributes, ...listeners } : {})}
			className={cn(
				"border mb-2 bg-white shadow-sm",
				isDragging
					? "opacity-50 cursor-grabbing"
					: isDraggable
						? "cursor-grab"
						: "",
				isCompact ? "p-0" : "",
			)}
		>
			<CardContent
				className={cn("flex items-center p-3", isCompact ? "py-2" : "")}
			>
				{getIcon()}
				<span className={cn(isCompact ? "text-sm" : "text-base")}>
					{assessment.title}
				</span>
			</CardContent>
		</Card>
	);
};

export default AssessmentItem;
