import * as z from "zod";

export const userFormSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	role: z.enum([
		"superAdmin",
		"companyAdmin",
		"courseCommander",
		"courseTrainer",
		"trainee",
	]),
	companyId: z.string().optional(),
	courseId: z.string().optional(),
	subcohortId: z.string().optional(),
	dateOfBirth: z.date(),
	weight: z.coerce.number().positive("Weight must be positive"),
	height: z.coerce.number().positive("Height must be positive"),
	gender: z.enum(["male", "female", "other"]),
});
