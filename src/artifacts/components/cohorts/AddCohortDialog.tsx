import { useState } from "react";
import { Button } from "@/components/ui/button";
import CohortFormDialog from "./CohortFormDialog";
import type { Cohort } from "../../types/userGroups";

interface AddCohortDialogProps {
	onAddCohort: (cohort: Omit<Cohort, "id" | "createdAt" | "updatedAt">) => void;
}

const AddCohortDialog = ({ onAddCohort }: AddCohortDialogProps) => {
	const [open, setOpen] = useState(false);

	return (
		<CohortFormDialog
			open={open}
			onOpenChange={setOpen}
			title="Create New Cohort"
			description="Add a new cohort to organize your users."
			submitLabel="Create Cohort"
			initialData={{
				name: "",
				description: "",
				customLabel: "Cohort",
				courseIds: [],
			}}
			onSubmit={onAddCohort}
			trigger={<Button>Add New Cohort</Button>}
		/>
	);
};

export default AddCohortDialog;
