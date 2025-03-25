import { EditUserDialog, type userFormSchema } from "./EditUserDialog";
import type { z } from "zod";
import type { UserRole } from "../..";

interface AddUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	roles: UserRole[];
	userRoleLabels: Record<UserRole, string>;
	courses: { id: string; name: string }[];
	subcohorts: { id: string; name: string; cohortId: string }[];
	onSave: (values: z.infer<typeof userFormSchema>) => void;
}

export function AddUserDialog({
	open,
	onOpenChange,
	roles,
	userRoleLabels,
	courses,
	subcohorts,
	onSave,
}: AddUserDialogProps) {
	// We reuse the EditUserDialog but pass null as the user prop to indicate this is for adding
	return (
		<EditUserDialog
			user={null}
			open={open}
			onOpenChange={onOpenChange}
			roles={roles}
			userRoleLabels={userRoleLabels}
			courses={courses}
			subcohorts={subcohorts}
			onSave={onSave}
		/>
	);
}
