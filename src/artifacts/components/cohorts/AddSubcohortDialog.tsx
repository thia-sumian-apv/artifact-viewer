import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Subcohort, Cohort } from "../../types/userGroups";
import SubcohortFormDialog from "./SubcohortFormDialog";
import { useState } from "react";

interface AddSubcohortDialogProps {
	cohort: Cohort;
	onAddSubcohort: (
		subcohort: Omit<Subcohort, "id" | "createdAt" | "updatedAt">,
	) => void;
}

const AddSubcohortDialog = ({
	cohort,
	onAddSubcohort,
}: AddSubcohortDialogProps) => {
	const [open, setOpen] = useState(false);

	return (
		<SubcohortFormDialog
			open={open}
			onOpenChange={setOpen}
			title="Create New Subcohort"
			description={`Add a new subcohort to ${cohort.name} (${cohort.customLabel}).`}
			submitLabel="Create Subcohort"
			cohort={cohort}
			initialData={{
				name: "",
				description: "",
				cohortId: cohort.id,
			}}
			onSubmit={onAddSubcohort}
			trigger={
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
					onClick={() => setOpen(true)}
				>
					<PlusCircle className="h-4 w-4" />
					<span className="sr-only">Add Subcohort</span>
				</Button>
			}
		/>
	);
};

export default AddSubcohortDialog;
