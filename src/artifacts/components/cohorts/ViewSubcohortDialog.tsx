import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getUsersBySubcohort } from "../../mocks/userData";
import type { Cohort, Subcohort } from "../../types/userGroups";
import type { UserRole } from "../..";

// Define role labels and badge variants like in UsersTab
const UserRoleLabels: Record<UserRole, string> = {
	superAdmin: "Super Admin",
	companyAdmin: "Company Admin",
	courseCommander: "Course Commander",
	courseTrainer: "Course Trainer",
	trainee: "Trainee",
};

const roleBadgeVariants: Record<UserRole, string> = {
	superAdmin: "destructive",
	companyAdmin: "default",
	courseCommander: "secondary",
	courseTrainer: "outline",
	trainee: "secondary",
};

interface ViewSubcohortDialogProps {
	subcohort: Subcohort;
	cohort: Cohort;
}

const ViewSubcohortDialog = ({
	subcohort,
	cohort,
}: ViewSubcohortDialogProps) => {
	const subcohortUsers = getUsersBySubcohort(subcohort.id);

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
				>
					<Eye className="h-4 w-4" />
					<span className="sr-only">View Subcohort</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[650px]">
				<DialogHeader>
					<DialogTitle className="text-xl">Subcohort Details</DialogTitle>
				</DialogHeader>

				<div className="mt-2 space-y-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-lg flex justify-between items-center">
								<span>{subcohort.name}</span>
								<Badge variant="outline" className="ml-2 px-2">
									ID: {subcohort.id}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 pt-0">
							<div>
								<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Description
								</h4>
								<p className="text-sm">{subcohort.description}</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Parent Cohort
									</h4>
									<p className="text-sm font-medium">
										{cohort.name}
										<Badge variant="secondary" className="ml-2 text-xs">
											{cohort.id}
										</Badge>
									</p>
								</div>
								<div>
									<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Member Count
									</h4>
									<p className="text-sm font-medium">
										{subcohortUsers.length} users
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Created
									</h4>
									<p className="text-sm">{formatDate(subcohort.createdAt)}</p>
								</div>
								<div>
									<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Last Updated
									</h4>
									<p className="text-sm">{formatDate(subcohort.updatedAt)}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">
								Members ({subcohortUsers.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							{subcohortUsers.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[180px]">Name</TableHead>
											<TableHead>Email</TableHead>
											<TableHead className="w-[150px]">Role</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{subcohortUsers.map((user) => (
											<TableRow key={user.id}>
												<TableCell className="font-medium">
													{user.firstName} {user.lastName}
												</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>
													<Badge
														variant={
															roleBadgeVariants[user.role as UserRole] as
																| "default"
																| "destructive"
																| "outline"
																| "secondary"
														}
														className="whitespace-nowrap"
													>
														{UserRoleLabels[user.role as UserRole]}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<div className="text-center py-6 text-gray-500">
									No members found in this subcohort
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ViewSubcohortDialog;
