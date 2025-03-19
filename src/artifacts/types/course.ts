export interface Course {
	id: string;
	code: string;
	name: string;
	description: string;
	createdBy: string;
	lastModified: string;
}

export const dummyCourseData: Course[] = [
	{
		id: "1",
		code: "CDO001",
		name: "CDO Course 1",
		description: "Course number 1",
		createdBy: "John Doe",
		lastModified: "2024-03-15",
	},
	{
		id: "2",
		code: "CDO002",
		name: "CDO Course 2",
		description: "Course number 2",
		createdBy: "John Doe",
		lastModified: "2024-03-14",
	},
];
