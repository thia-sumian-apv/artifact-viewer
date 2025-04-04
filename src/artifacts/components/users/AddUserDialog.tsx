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
	// We reuse the EditUserDialog but with isNewUser=true to indicate this is for creating a new user
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
			isNewUser={true}
		/>
	);
}