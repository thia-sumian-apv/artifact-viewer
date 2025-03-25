import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Subcohort, Cohort } from "../../types/userGroups";
import SubcohortFormDialog from "./SubcohortFormDialog";
import { useState } from "react";

interface EditSubcohortDialogProps {
	subcohort: Subcohort;
	cohort: Cohort;
	onEditSubcohort: (
		id: string,
		subcohortData: Omit<Subcohort, "id" | "createdAt" | "updatedAt">,
	) => void;
}

const EditSubcohortDialog = ({
	subcohort,
	cohort,
	onEditSubcohort,
}: EditSubcohortDialogProps) => {
	const [open, setOpen] = useState(false);

	const handleEditSubcohort = (
		subcohortData: Omit<Subcohort, "id" | "createdAt" | "updatedAt">,
	) => {
		onEditSubcohort(subcohort.id, subcohortData);
	};

	return (
		<SubcohortFormDialog
			open={open}
			onOpenChange={setOpen}
			title={"Edit Subcohort"}
			description={`Update the information for ${subcohort.name}`}
			submitLabel="Save Changes"
			cohort={cohort}
			initialData={subcohort}
			onSubmit={handleEditSubcohort}
			trigger={
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
					onClick={() => setOpen(true)}
				>
					<Pencil className="h-4 w-4" />
					<span className="sr-only">Edit</span>
				</Button>
			}
		/>
	);
};

export default EditSubcohortDialog;
