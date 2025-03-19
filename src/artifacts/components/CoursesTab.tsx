import { Pencil, Trash2, Eye, Calendar, User } from "lucide-react";
import { dummyCourseData } from "../types/course";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AddCourseDialog } from "./courses/AddCourseDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const CoursesTab = () => {
	const [selectedCourse, setSelectedCourse] = useState<
		(typeof dummyCourseData)[0] | null
	>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);

	const handleEdit = (course: (typeof dummyCourseData)[0]) => {
		setSelectedCourse(course);
		setEditDialogOpen(true);
	};

	const handleView = (course: (typeof dummyCourseData)[0]) => {
		setSelectedCourse(course);
		setViewDialogOpen(true);
	};

	const handleDelete = (id: string) => {
		console.log("Delete course:", id);
	};

	return (
		<div className="space-y-6">
			<Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<CardTitle>Courses</CardTitle>
					<Button onClick={() => setAddDialogOpen(true)}>Add Course</Button>
				</CardHeader>
				<CardContent>
					<div className="border rounded-lg">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Course Code</TableHead>
									<TableHead>Course Name</TableHead>
									<TableHead className="max-w-[300px]">Description</TableHead>
									<TableHead>Created By</TableHead>
									<TableHead>Last Modified</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{dummyCourseData.map((course) => (
									<TableRow key={course.id}>
										<TableCell className="font-medium">{course.code}</TableCell>
										<TableCell>{course.name}</TableCell>
										<TableCell className="max-w-[300px] truncate">
											{course.description}
										</TableCell>
										<TableCell>{course.createdBy}</TableCell>
										<TableCell>
											{new Date(course.lastModified).toLocaleDateString()}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleView(course)}
													className="h-8 w-8 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
												>
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleEdit(course)}
													className="h-8 w-8 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
												>
													<Pencil className="h-4 w-4" />
												</Button>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => handleDelete(course.id)}
													className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Add this near your other dialogs */}
			<AddCourseDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
			{/* View Course Dialog */}
			<Dialog
				open={viewDialogOpen}
				onOpenChange={(open) => {
					if (!open) {
						setViewDialogOpen(false);
						setTimeout(() => {
							setSelectedCourse(null);
						}, 100);
					}
				}}
				modal={true}
			>
				<DialogContent
					className="sm:max-w-[525px]"
					aria-describedby={undefined}
					onPointerDownOutside={(e) => e.preventDefault()}
					onEscapeKeyDown={() => setViewDialogOpen(false)}
				>
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							Course Details
						</DialogTitle>
					</DialogHeader>
					{selectedCourse && (
						<div className="space-y-6">
							{/* Course Code and Name */}
							<div className="space-y-1">
								<h3 className="text-sm font-medium text-muted-foreground">
									{selectedCourse.code}
								</h3>
								<h2 className="text-2xl font-semibold">
									{selectedCourse.name}
								</h2>
							</div>

							{/* Description */}
							<div className="space-y-2">
								<h4 className="text-sm font-medium text-muted-foreground">
									Description
								</h4>
								<p className="text-sm">{selectedCourse.description}</p>
							</div>

							{/* Metadata */}
							<div className="grid grid-cols-2 gap-4 pt-4 border-t">
								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<User className="h-4 w-4 mr-2 text-muted-foreground" />
										<span className="font-medium">Created By</span>
									</div>
									<p className="text-sm text-muted-foreground">
										{selectedCourse.createdBy}
									</p>
								</div>

								<div className="space-y-2">
									<div className="flex items-center text-sm">
										<Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
										<span className="font-medium">Last Modified</span>
									</div>
									<p className="text-sm text-muted-foreground">
										{new Date(selectedCourse.lastModified).toLocaleDateString()}
									</p>
								</div>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
			<Dialog
				open={editDialogOpen}
				onOpenChange={(open) => {
					if (!open) {
						// First close the dialog
						setEditDialogOpen(false);
						// Then reset the selected course after a short delay
						setTimeout(() => {
							setSelectedCourse(null);
						}, 100);
					}
				}}
				modal={true}
			>
				<DialogContent
					className="sm:max-w-[525px]"
					aria-describedby={undefined}
					onPointerDownOutside={(e) => e.preventDefault()}
					onEscapeKeyDown={() => setEditDialogOpen(false)}
				>
					<DialogHeader>
						<DialogTitle className="text-xl font-semibold">
							Edit Course
						</DialogTitle>
					</DialogHeader>
					{selectedCourse && (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								// Handle form submission here
								setEditDialogOpen(false);
								setTimeout(() => {
									setSelectedCourse(null);
								}, 100);
							}}
						>
							<div className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="code" className="text-sm font-medium">
										Course Code
									</label>
									<input
										id="code"
										defaultValue={selectedCourse.code}
										className="w-full p-2 border rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="name" className="text-sm font-medium">
										Course Name
									</label>
									<input
										id="name"
										defaultValue={selectedCourse.name}
										className="w-full p-2 border rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="description" className="text-sm font-medium">
										Description
									</label>
									<textarea
										id="description"
										defaultValue={selectedCourse.description}
										className="w-full p-2 border rounded-md bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50"
										rows={4}
									/>
								</div>
								<div className="flex justify-end space-x-2 pt-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => {
											setEditDialogOpen(false);
											setTimeout(() => {
												setSelectedCourse(null);
											}, 100);
										}}
									>
										Cancel
									</Button>
									<Button type="submit">Save Changes</Button>
								</div>
							</div>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CoursesTab;
