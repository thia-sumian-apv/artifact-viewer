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
import { Users } from "lucide-react";
import { getUsersBySubcohort } from "../../mocks/userData";
import type { Cohort, Subcohort } from "../../types/userGroups";

interface ViewCohortDialogProps {
	cohort: Cohort;
	subcohorts: Subcohort[];
}

const ViewCohortDialog = ({ cohort, subcohorts }: ViewCohortDialogProps) => {
	const cohortSubcohorts = subcohorts.filter(
		(subcohort) => subcohort.cohortId === cohort.id,
	);

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
					<span className="sr-only">View Cohort</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[700px]">
				<DialogHeader>
					<DialogTitle className="text-xl">Cohort Details</DialogTitle>
				</DialogHeader>

				<div className="mt-2 space-y-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-lg flex justify-between items-center">
								<span>{cohort.name}</span>
								<Badge variant="outline" className="ml-2 px-2">
									ID: {cohort.id}
								</Badge>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 pt-0">
							<div>
								<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
									Description
								</h4>
								<p className="text-sm">{cohort.description}</p>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Created
									</h4>
									<p className="text-sm">{formatDate(cohort.createdAt)}</p>
								</div>
								<div>
									<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
										Last Updated
									</h4>
									<p className="text-sm">{formatDate(cohort.updatedAt)}</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-lg flex justify-between items-center">
								<span>Subcohorts</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-4">
							{cohortSubcohorts.length > 0 ? (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[120px]">ID</TableHead>
											<TableHead className="w-[180px]">Name</TableHead>
											<TableHead>Description</TableHead>
											<TableHead className="w-[90px] text-center">
												Members
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{cohortSubcohorts.map((subcohort) => (
											<TableRow key={subcohort.id}>
												<TableCell className="font-medium">
													{subcohort.id}
												</TableCell>
												<TableCell>{subcohort.name}</TableCell>
												<TableCell className="max-w-[250px] truncate">
													{subcohort.description}
												</TableCell>
												<TableCell className="text-center">
													<div className="flex justify-center">
														<Badge
															variant="outline"
															className="inline-flex items-center h-6 px-2 gap-1"
														>
															<Users className="h-3 w-3" />
															{getUsersBySubcohort(subcohort.id).length}
														</Badge>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							) : (
								<div className="text-center py-6 text-gray-500">
									No subcohorts found for this cohort
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ViewCohortDialog;
