import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User } from "../../types/users";
import type { UserRole } from "../..";
import { mockCompanyData } from "../../mocks/companyData";
import {
	getSubcohortsByCohortId,
	mockCohorts,
	mockSubcohorts,
} from "../../mocks/cohortData";
import { dummyCourseData } from "../../mocks/courseData";
import {
	getCourseDetailsForUser,
	getTrainersForTrainee,
	getUsersBySubcohort,
	mockUsers,
} from "../../mocks/userData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Calendar,
	BookUser,
	Users,
	Building2,
	Clock,
	GraduationCap,
	BookOpen,
} from "lucide-react";

interface ViewUserDialogProps {
	user: User | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	roleBadgeVariants: Record<UserRole, string>;
	userRoleLabels: Record<UserRole, string>;
}

const getCourseInfo = (courseIds?: string[]) => {
	if (!courseIds || courseIds.length === 0) return [];
	return dummyCourseData.filter((course) => courseIds.includes(course.id));
};

export function ViewUserDialog({
	user,
	open,
	onOpenChange,
	roleBadgeVariants,
	userRoleLabels,
}: ViewUserDialogProps) {
	if (!user) return null;

	// Get company name
	const companyName =
		"companyId" in user && user.companyId
			? mockCompanyData.find((c) => c.id === user.companyId)?.name || "System"
			: "System";

	// Get cohort information for trainee and course trainer
	const cohortInfo =
		"subcohortId" in user && user.subcohortId
			? mockCohorts.find(
					(c) =>
						c.id ===
						mockSubcohorts.find((s) => s.id === user.subcohortId)?.cohortId,
				)
			: null;

	console.log(user, cohortInfo);

	// Get course information using our new helper
	const courseInfo = getCourseDetailsForUser(user);

	// Find trainers for trainees using our new helper
	const userTrainers =
		user.role === "trainee" ? getTrainersForTrainee(user.id) : [];

	// Find trainees for trainers using existing helper
	const trainerTrainees =
		user.role === "courseTrainer" && "subcohortId" in user && user.subcohortId
			? getUsersBySubcohort(user.subcohortId)
			: [];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] md:max-w-[700px] overflow-y-auto max-h-[90vh]">
				<DialogHeader className="pb-2">
					<DialogTitle>User Details</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/30 rounded-lg">
					<Avatar className="h-16 w-16">
						<AvatarImage src="" alt={`${user.firstName} ${user.lastName}`} />
						<AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-500 dark:text-teal-300 text-lg">
							{user.firstName[0]}
							{user.lastName[0]}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-xl font-semibold">
							{user.firstName} {user.lastName}
						</h2>
						<p className=" text-sm">{user.email}</p>
						<div className="flex flex-wrap items-center gap-2 mt-2">
							<Badge
								variant={
									roleBadgeVariants[user.role as UserRole] as
										| "default"
										| "destructive"
										| "outline"
										| "secondary"
								}
							>
								{userRoleLabels[user.role as UserRole]}
							</Badge>
							<Badge variant="outline" className="flex items-center gap-1">
								<Building2 className="h-3 w-3" />
								{companyName}
							</Badge>
						</div>
					</div>
				</div>

				<Tabs defaultValue="profile" className="w-full">
					<TabsList className="grid w-full grid-cols-3 mb-4">
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="assignments">Assignments</TabsTrigger>
						<TabsTrigger value="details">Details</TabsTrigger>
					</TabsList>

					{/* Profile Tab */}
					<TabsContent value="profile" className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Card>
								<CardHeader className="py-3">
									<CardTitle className="text-sm">
										Personal Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm ">Age</span>
										<span className="text-sm font-medium">{user.age}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm ">Gender</span>
										<span className="text-sm font-medium">{user.gender}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm ">Height</span>
										<span className="text-sm font-medium">
											{user.height} cm
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm ">Weight</span>
										<span className="text-sm font-medium">
											{user.weight} kg
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm ">Date of Birth</span>
										<span className="text-sm font-medium">
											{user.dateOfBirth.toLocaleDateString()}
										</span>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader className="py-3">
									<CardTitle className="text-sm">Account Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 py-0">
									<div className="flex items-center justify-between">
										<span className="text-sm ">Created</span>
										<span className="text-sm font-medium flex items-center gap-1">
											<Calendar className="h-3.5 w-3.5" />
											{user.createdAt.toLocaleDateString()}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm ">Last Updated</span>
										<span className="text-sm font-medium flex items-center gap-1">
											<Clock className="h-3.5 w-3.5" />
											{user.updatedAt.toLocaleDateString()}
										</span>
									</div>

									{user.role === "trainee" && userTrainers.length > 0 && (
										<div className="mt-4">
											<span className="text-sm  block mb-2">
												Assigned Trainers
											</span>
											<div className="flex flex-col gap-2">
												{userTrainers.map((trainer) => (
													<div
														key={trainer.id}
														className="flex items-center gap-2 bg-muted/50 p-2 rounded"
													>
														<GraduationCap className="h-4 w-4 " />
														<span className="text-sm">
															{trainer.firstName} {trainer.lastName}
														</span>
													</div>
												))}
											</div>
										</div>
									)}

									{user.role === "courseTrainer" &&
										trainerTrainees.length > 0 && (
											<div className="mt-4">
												<span className="text-sm  block mb-2">
													Assigned Trainees
												</span>
												<div className="flex items-center gap-1">
													<BookUser className="h-4 w-4 " />
													<span className="text-sm">
														{trainerTrainees.length} trainees
													</span>
												</div>
											</div>
										)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Assignments Tab */}
					<TabsContent value="assignments">
						<ScrollArea className="pr-4 h-[400px]">
							{user.role === "superAdmin" || user.role === "companyAdmin" ? (
								<Card className="mb-4">
									<CardHeader>
										<CardTitle className="text-base">
											No Assignments Available
										</CardTitle>
									</CardHeader>
								</Card>
							) : (
								<Card className="mb-4">
									<CardHeader>
										<CardTitle className="text-base">
											Course Assignment
										</CardTitle>
										<CardDescription>Course information</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{courseInfo.length === 0 ? (
												<div className="text-sm ">
													No course assignment information available.
												</div>
											) : (
												courseInfo.map((course) => (
													<div key={course.id} className="space-y-2">
														<div className="flex justify-between">
															<div className="flex items-center gap-2">
																<BookOpen className="h-4 w-4 " />
																<span className="font-medium">
																	{course.name}
																</span>
															</div>
															<Badge variant="outline">{course.code}</Badge>
														</div>
														<p className="text-sm ">{course.description}</p>
														<Separator />
													</div>
												))
											)}
										</div>
									</CardContent>
								</Card>
							)}

							{(user.role === "courseTrainer" || user.role === "trainee") &&
								cohortInfo && (
									<Card>
										<CardHeader>
											<CardTitle className="text-base">
												Cohort Assignment
											</CardTitle>
											<CardDescription>
												Cohort and subcohort information
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Users className="h-4 w-4 " />
														<span className="font-medium">
															{cohortInfo.name}
														</span>
													</div>
													<Badge variant="outline">
														{cohortInfo.customLabel}
													</Badge>
												</div>

												{"subcohortId" in user && user.subcohortId && (
													<div className="pl-6 border-l border-muted">
														<p className="text-sm font-medium mb-1">
															Subcohort
														</p>
														<div className="bg-muted/50 p-2 rounded text-sm">
															{getSubcohortsByCohortId(cohortInfo.id).find(
																(s) => s.id === user.subcohortId,
															)?.name || user.subcohortId}
														</div>
													</div>
												)}

												{user.role === "trainee" &&
													"buddyIds" in user &&
													user.buddyIds?.length > 0 && (
														<div className="pl-6 border-l border-muted mt-4">
															<p className="text-sm font-medium mb-1">
																Training Buddies
															</p>
															<div className="flex flex-wrap gap-2">
																{user.buddyIds.map((buddyId) => {
																	const buddy = mockUsers.find(
																		(u) => u.id === buddyId,
																	);
																	return (
																		<Badge
																			key={buddyId}
																			variant="secondary"
																			className="flex items-center gap-1 py-1"
																		>
																			<BookUser className="h-3 w-3" />
																			{buddy
																				? `${buddy.firstName} ${buddy.lastName}`
																				: buddyId}
																		</Badge>
																	);
																})}
															</div>
														</div>
													)}
											</div>
										</CardContent>
									</Card>
								)}
						</ScrollArea>
					</TabsContent>

					{/* Details Tab */}
					<TabsContent value="details">
						<ScrollArea className="pr-4 h-[400px]">
							<Card>
								<CardHeader className="py-3">
									<CardTitle className="text-sm">
										User ID and System Details
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 py-2">
									<div className="flex justify-between">
										<span className="text-sm ">User ID</span>
										<span className="text-sm font-mono">{user.id}</span>
									</div>
									{"companyId" in user && user.companyId && (
										<div className="flex justify-between">
											<span className="text-sm ">Company ID</span>
											<span className="text-sm font-mono">
												{user.companyId}
											</span>
										</div>
									)}
									{user.role === "courseCommander" && "courseIds" in user && (
										<div className="flex justify-between">
											<span className="text-sm ">Course IDs</span>
											<span className="text-sm font-mono">
												{user.courseIds?.join(", ") || "None"}
											</span>
										</div>
									)}

									{"subcohortId" in user && user.subcohortId && (
										<div className="flex justify-between">
											<span className="text-sm ">Cohort ID</span>
											<span className="text-sm font-mono">
												{mockSubcohorts.find((s) => s.id === user.subcohortId)
													?.cohortId || "Unknown"}
											</span>
										</div>
									)}
									{"subcohortId" in user && user.subcohortId && (
										<div className="flex justify-between">
											<span className="text-sm ">Subcohort ID</span>
											<span className="text-sm font-mono">
												{user.subcohortId}
											</span>
										</div>
									)}
									{user.role === "trainee" && "trainerIds" in user && (
										<div className="flex justify-between">
											<span className="text-sm ">Trainer IDs</span>
											<span className="text-sm font-mono">
												{user.trainerIds?.join(", ") || "None"}
											</span>
										</div>
									)}
									{user.role === "trainee" && "buddyIds" in user && (
										<div className="flex justify-between">
											<span className="text-sm ">Buddy IDs</span>
											<span className="text-sm font-mono">
												{user.buddyIds?.join(", ") || "None"}
											</span>
										</div>
									)}
									{user.role === "courseCommander" &&
										"courseIds" in user &&
										user.courseIds?.length > 0 && (
											<>
												<div className="flex justify-between">
													<span className="text-sm ">Course IDs</span>
													<span className="text-sm font-mono">
														{user.courseIds.join(", ")}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-sm ">Course Codes</span>
													<span className="text-sm font-medium">
														{getCourseInfo(user.courseIds)
															.map((c) => c.code)
															.join(", ")}
													</span>
												</div>
											</>
										)}
								</CardContent>
							</Card>

							<Card className="mt-4">
								<CardHeader className="py-3">
									<CardTitle className="text-sm">System Timestamps</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 py-2">
									<div className="flex justify-between">
										<span className="text-sm ">Created At (ISO)</span>
										<span className="text-sm font-mono">
											{user.createdAt.toISOString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm ">Updated At (ISO)</span>
										<span className="text-sm font-mono">
											{user.updatedAt.toISOString()}
										</span>
									</div>
								</CardContent>
							</Card>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
