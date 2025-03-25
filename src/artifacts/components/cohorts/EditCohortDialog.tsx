import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import CohortFormDialog from "./CohortFormDialog";
import type { Cohort } from "../../types/userGroups";

interface EditCohortDialogProps {
	cohort: Cohort;
	onEditCohort: (
		id: string,
		cohortData: Omit<Cohort, "id" | "createdAt" | "updatedAt">,
	) => void;
}

const EditCohortDialog = ({ cohort, onEditCohort }: EditCohortDialogProps) => {
	const [open, setOpen] = useState(false);

	const handleEditCohort = (
		cohortData: Omit<Cohort, "id" | "createdAt" | "updatedAt">,
	) => {
		onEditCohort(cohort.id, cohortData);
	};

	return (
		<CohortFormDialog
			open={open}
			onOpenChange={setOpen}
			title={`Edit ${cohort.customLabel}`}
			description={`Update the information for ${cohort.name}`}
			submitLabel="Save Changes"
			initialData={cohort}
			onSubmit={handleEditCohort}
			trigger={
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
				>
					<Pencil className="h-4 w-4" />
					<span className="sr-only">Edit</span>
				</Button>
			}
		/>
	);
};

export default EditCohortDialog;
