import { useEffect, useRef, useState } from "react";
import { mockCohorts, mockSubcohorts } from "../mocks/cohortData";
import { getUsersByCohort, getUsersBySubcohort } from "../mocks/userData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Search, Trash2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import AddCohortDialog from "./cohorts/AddCohortDialog";
import type { Cohort, Subcohort } from "../types/userGroups";
import AddSubcohortDialog from "./cohorts/AddSubcohortDialog";
import EditSubcohortDialog from "./cohorts/EditSubcohortDialog";
import EditCohortDialog from "./cohorts/EditCohortDialog";
import ViewCohortDialog from "./cohorts/ViewCohortDialog";
import ViewSubcohortDialog from "./cohorts/ViewSubcohortDialog";

const CohortsTab = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				searchInputRef.current &&
				!searchInputRef.current.contains(event.target as Node) &&
				isSearchExpanded &&
				searchQuery === ""
			) {
				setIsSearchExpanded(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isSearchExpanded, searchQuery]);

	// Focus input when expanded
	useEffect(() => {
		if (isSearchExpanded && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isSearchExpanded]);

	const [expandedCohorts, setExpandedCohorts] = useState<string[]>([]);
	const [cohorts, setCohorts] = useState(mockCohorts);
	const [subcohorts, setSubcohorts] = useState(mockSubcohorts);

	const toggleCohortExpansion = (cohortId: string) => {
		if (expandedCohorts.includes(cohortId)) {
			setExpandedCohorts(expandedCohorts.filter((id) => id !== cohortId));
		} else {
			setExpandedCohorts([...expandedCohorts, cohortId]);
		}
	};

	const handleAddCohort = (
		cohortData: Omit<Cohort, "id" | "createdAt" | "updatedAt">,
	) => {
		const newCohort: Cohort = {
			...cohortData,
			id: `cohort-${Date.now()}`, // Generate a unique ID
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setCohorts([...cohorts, newCohort]);
	};

	const handleEditCohort = (
		id: string,
		cohortData: Omit<Cohort, "id" | "createdAt" | "updatedAt">,
	) => {
		setCohorts(
			cohorts.map((cohort) =>
				cohort.id === id
					? {
							...cohort,
							...cohortData,
							updatedAt: new Date(),
						}
					: cohort,
			),
		);
	};

	const handleAddSubcohort = (
		subcohortData: Omit<Subcohort, "id" | "createdAt" | "updatedAt">,
	) => {
		const newSubcohort: Subcohort = {
			...subcohortData,
			id: `subcohort-${Date.now()}`, // Generate a unique ID
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setSubcohorts([...subcohorts, newSubcohort]);
	};

	const handleEditSubcohort = (
		id: string,
		subcohortData: Omit<Subcohort, "id" | "createdAt" | "updatedAt">,
	) => {
		setSubcohorts(
			subcohorts.map((subcohort) =>
				subcohort.id === id
					? {
							...subcohort,
							...subcohortData,
							updatedAt: new Date(),
						}
					: subcohort,
			),
		);
	};

	const getSubcohortsByCohortId = (cohortId: string) => {
		return subcohorts.filter((subcohort) => subcohort.cohortId === cohortId);
	};

	const getTotalCohortMembers = (cohortId: string) => {
		// Get direct members of the cohort
		const directMembers = getUsersByCohort(cohortId).length;

		// Get members from all subcohorts belonging to this cohort
		const subcohortMembers = getSubcohortsByCohortId(cohortId).reduce(
			(total, subcohort) => {
				return total + getUsersBySubcohort(subcohort.id).length;
			},
			0,
		);

		// Return the total count
		return directMembers + subcohortMembers;
	};

	const filteredCohorts = cohorts.filter(
		(cohort) =>
			searchQuery === "" ||
			cohort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cohort.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
			cohort.description.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(date);
	};

	return (
		<Card className="shadow-sm">
			<CardContent className="pt-6">
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">Cohort Management</h2>
						<div className="flex items-center gap-2">
							<div
								className={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-64" : "w-8"}`}
							>
								{isSearchExpanded ? (
									<div className="relative w-full">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
										<Input
											ref={searchInputRef}
											placeholder="Search cohorts..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="pl-9 h-9 text-sm w-full"
										/>
									</div>
								) : (
									<Button
										variant="ghost"
										size="icon"
										onClick={() => setIsSearchExpanded(true)}
										className="h-9 w-9 p-0"
									>
										<Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
										<span className="sr-only">Search</span>
									</Button>
								)}
							</div>
							<AddCohortDialog onAddCohort={handleAddCohort} />
						</div>
					</div>
					<div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[40px]" />
									<TableHead className="w-[120px]">ID</TableHead>
									<TableHead className="w-[180px]">Name</TableHead>
									<TableHead>Description</TableHead>
									<TableHead className="w-[130px]">Last Updated</TableHead>
									<TableHead className="w-[100px] text-center">
										Members
									</TableHead>
									<TableHead className="w-[150px] text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredCohorts.map((cohort) => (
									<>
										<TableRow key={cohort.id}>
											<TableCell className="p-0 text-center">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => toggleCohortExpansion(cohort.id)}
													className="h-8 w-8 p-0"
												>
													{expandedCohorts.includes(cohort.id) ? (
														<ChevronDown className="h-4 w-4" />
													) : (
														<ChevronRight className="h-4 w-4" />
													)}
												</Button>
											</TableCell>
											<TableCell className="font-medium">{cohort.id}</TableCell>
											<TableCell>{cohort.name}</TableCell>
											<TableCell className="max-w-[300px] truncate">
												{cohort.description}
											</TableCell>
											<TableCell>{formatDate(cohort.updatedAt)}</TableCell>
											<TableCell className="text-center">
												<div className="flex justify-center">
													<Badge
														variant="outline"
														className="inline-flex items-center h-6 px-2 gap-1"
													>
														<Users className="h-3 w-3" />
														{getTotalCohortMembers(cohort.id)}
													</Badge>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center space-x-1">
													<AddSubcohortDialog
														cohort={cohort}
														onAddSubcohort={handleAddSubcohort}
													/>
													<ViewCohortDialog
														cohort={cohort}
														subcohorts={subcohorts}
													/>
													<EditCohortDialog
														cohort={cohort}
														onEditCohort={handleEditCohort}
													/>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
													>
														<Trash2 className="h-4 w-4" />
														<span className="sr-only">Delete</span>
													</Button>
												</div>
											</TableCell>
										</TableRow>

										{expandedCohorts.includes(cohort.id) && (
											<TableRow className="hover:bg-transparent">
												<TableCell colSpan={7} className="p-0">
													<div className="pl-10 pr-4 py-4 bg-gray-50 dark:bg-gray-800/50">
														<h4 className="text-sm font-medium mb-3 ml-2 text-gray-700 dark:text-gray-300">
															Subcohorts
														</h4>
														<Table>
															<TableHeader>
																<TableRow className="bg-gray-100 dark:bg-gray-800">
																	<TableHead className="w-[120px]">
																		ID
																	</TableHead>
																	<TableHead className="w-[180px]">
																		Name
																	</TableHead>
																	<TableHead>Description</TableHead>
																	<TableHead className="w-[130px]">
																		Last Updated
																	</TableHead>
																	<TableHead className="w-[100px] text-center">
																		Members
																	</TableHead>
																	<TableHead className="w-[150px]">
																		Actions
																	</TableHead>
																</TableRow>
															</TableHeader>
															<TableBody>
																{getSubcohortsByCohortId(cohort.id).map(
																	(subcohort) => (
																		<TableRow key={subcohort.id}>
																			<TableCell className="font-medium">
																				{subcohort.id}
																			</TableCell>
																			<TableCell>{subcohort.name}</TableCell>
																			<TableCell className="max-w-[300px] truncate">
																				{subcohort.description}
																			</TableCell>
																			<TableCell>
																				{formatDate(subcohort.updatedAt)}
																			</TableCell>
																			<TableCell className="text-center">
																				<div className="flex justify-center">
																					<Badge
																						variant="outline"
																						className="inline-flex items-center h-6 px-2 gap-1"
																					>
																						<Users className="h-3 w-3" />
																						{
																							getUsersBySubcohort(subcohort.id)
																								.length
																						}
																					</Badge>
																				</div>
																			</TableCell>
																			<TableCell>
																				<div className="flex items-center space-x-1">
																					<ViewSubcohortDialog
																						subcohort={subcohort}
																						cohort={cohort}
																					/>
																					<EditSubcohortDialog
																						subcohort={subcohort}
																						onEditSubcohort={
																							handleEditSubcohort
																						}
																						cohort={cohort}
																					/>
																					<Button
																						variant="ghost"
																						size="icon"
																						className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
																					>
																						<Trash2 className="h-4 w-4" />
																						<span className="sr-only">
																							Delete
																						</span>
																					</Button>
																				</div>
																			</TableCell>
																		</TableRow>
																	),
																)}
															</TableBody>
														</Table>
													</div>
												</TableCell>
											</TableRow>
										)}
									</>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CohortsTab;
