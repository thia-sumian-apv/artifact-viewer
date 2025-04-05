import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Search,
	ArrowUpDown,
	Download,
	Upload,
	Pencil,
	Eye,
	Trash2,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { mockPhysicalProfiles } from "../../mocks/physicalData";
import type { UserPhysicalProfile } from "../../types/physical";
import { mockCompanyData } from "../../mocks/companyData";
import { ViewPhysicalStatsDialog } from "./ViewPhysicalState";
import { EditPhysicalStatsDialog } from "./EditPhysicalStatsDialog";

type PhysicalDataUpdate = {
	userId: string;
	type: string;
	weight?: number;
	// Other potential properties based on the error
};

// Helper function to get company name
const getCompanyName = (companyId?: string): string => {
	if (!companyId) return "System";
	const company = mockCompanyData.find((c) => c.id === companyId);
	return company ? company.name : "Unknown";
};

const PhysicalStatsAdminView = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// State for selection
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

	// State for sorting
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "ascending" | "descending";
	} | null>(null);

	// State for pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const itemsPerPageOptions = [10, 25, 50, 100];

	// Selected profile for viewing details
	const [selectedProfile, setSelectedProfile] =
		useState<UserPhysicalProfile | null>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	// Handle click outside search
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

	// Handle select all
	const handleSelectAll = () => {
		if (selectedUsers.length === paginatedProfiles.length) {
			setSelectedUsers([]);
		} else {
			setSelectedUsers(paginatedProfiles.map((profile) => profile.userId));
		}
	};

	// Handle single user selection
	const handleSelectUser = (userId: string) => {
		if (selectedUsers.includes(userId)) {
			setSelectedUsers(selectedUsers.filter((id) => id !== userId));
		} else {
			setSelectedUsers([...selectedUsers, userId]);
		}
	};

	// Mass action handlers
	const handleMassExport = () => {
		console.log("Export physical data for users:", selectedUsers);
		// Implement export logic here
		setSelectedUsers([]);
	};

	// Handle sort request
	const requestSort = (key: string) => {
		let direction: "ascending" | "descending" = "ascending";

		if (
			sortConfig &&
			sortConfig.key === key &&
			sortConfig.direction === "ascending"
		) {
			direction = "descending";
		}

		setSortConfig({ key, direction });
	};

	// Handle items per page change
	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1);
	};

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	// Sorting function for profiles
	const sortedProfiles = [...mockPhysicalProfiles].sort((a, b) => {
		if (!sortConfig) return 0;

		let aValue: string | number | Date | undefined;
		let bValue: string | number | Date | undefined;

		switch (sortConfig.key) {
			case "firstName":
				aValue = a.user.firstName;
				bValue = b.user.firstName;
				break;
			case "lastName":
				aValue = a.user.lastName;
				bValue = b.user.lastName;
				break;
			case "company":
				aValue =
					"companyId" in a.user && a.user.companyId
						? getCompanyName(a.user.companyId)
						: "System";
				bValue =
					"companyId" in b.user && b.user.companyId
						? getCompanyName(b.user.companyId)
						: "System";
				break;
			case "weight":
				aValue = a.weight;
				bValue = b.weight;
				return sortConfig.direction === "ascending"
					? aValue - bValue
					: bValue - aValue;
			case "injuries":
				aValue = a.injuries.length;
				bValue = b.injuries.length;
				return sortConfig.direction === "ascending"
					? aValue - bValue
					: bValue - aValue;
			case "lastUpdated":
				aValue = a.lastUpdated.getTime();
				bValue = b.lastUpdated.getTime();
				return sortConfig.direction === "ascending"
					? aValue - bValue
					: bValue - aValue;
			default:
				return 0;
		}

		if (typeof aValue === "string" && typeof bValue === "string") {
			return sortConfig.direction === "ascending"
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue);
		}

		return 0;
	});

	// Filter profiles based on search
	const filteredProfiles = sortedProfiles.filter((profile) => {
		const user = profile.user;
		const searchLower = searchQuery.toLowerCase();

		// Apply search filter
		return (
			searchQuery === "" ||
			`${user.firstName} ${user.lastName}`
				.toLowerCase()
				.includes(searchLower) ||
			user.email.toLowerCase().includes(searchLower) ||
			("companyId" in user && user.companyId
				? getCompanyName(user.companyId).toLowerCase().includes(searchLower)
				: false) ||
			(profile.ipptRecords.length > 0 &&
				profile.ipptRecords[0].award.toLowerCase().includes(searchLower)) ||
			(profile.injuries.length > 0 &&
				profile.injuries.some(
					(injury) =>
						injury.injuryType.toLowerCase().includes(searchLower) ||
						injury.status.toLowerCase().includes(searchLower),
				))
		);
	});

	// Paginate the filtered profiles
	const paginatedProfiles = filteredProfiles.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages = [];
		const maxPagesToShow = 5; // Show at most 5 page numbers

		if (totalPages <= maxPagesToShow) {
			// If total pages is less than max to show, display all pages
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			// Calculate start and end page numbers
			let startPage = Math.max(2, currentPage - 1);
			let endPage = Math.min(totalPages - 1, currentPage + 1);

			// Adjust if we're near the beginning
			if (currentPage <= 3) {
				endPage = 4;
			}

			// Adjust if we're near the end
			if (currentPage >= totalPages - 2) {
				startPage = totalPages - 3;
			}

			// Add ellipsis after first page if needed
			if (startPage > 2) {
				pages.push("ellipsis-start");
			}

			// Add middle pages
			for (let i = startPage; i <= endPage; i++) {
				pages.push(i);
			}

			// Add ellipsis before last page if needed
			if (endPage < totalPages - 1) {
				pages.push("ellipsis-end");
			}

			// Always show last page
			pages.push(totalPages);
		}

		return pages;
	};

	const handleSaveProfile = (data: PhysicalDataUpdate) => {
		console.log("Saving physical profile data:", data);
		setEditDialogOpen(false);
	};

	return (
		<Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
			<CardContent className="pt-6">
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">Physical Stats Management</h2>
						{selectedUsers.length > 0 && (
							<Badge variant="outline" className="ml-2 px-2 py-1">
								{selectedUsers.length} selected
							</Badge>
						)}
						<div className="flex items-center gap-2">
							<div
								className={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-64" : "w-8"}`}
							>
								{isSearchExpanded ? (
									<div className="relative w-full">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
										<Input
											ref={searchInputRef}
											placeholder="Search name, company, IPPT status..."
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
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className={`flex items-center gap-1 ${
											selectedUsers.length > 0
												? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
												: ""
										}`}
									>
										{selectedUsers.length > 0 ? (
											<>Actions ({selectedUsers.length})</>
										) : (
											<>Actions</>
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									{selectedUsers.length > 0 && (
										<>
											<DropdownMenuLabel>Selected Users</DropdownMenuLabel>
											<DropdownMenuItem
												onClick={handleMassExport}
												className="text-blue-600 dark:text-blue-400"
											>
												<Download className="h-4 w-4 mr-2" />
												Export Data
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => setSelectedUsers([])}>
												Clear Selection ({selectedUsers.length})
											</DropdownMenuItem>
											<DropdownMenuSeparator />
										</>
									)}
									<DropdownMenuLabel>Import/Export</DropdownMenuLabel>
									<DropdownMenuItem>
										<Upload className="h-4 w-4 mr-2" />
										Import Physical Data
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Download className="h-4 w-4 mr-2" />
										Export All Data
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{selectedUsers.length > 0 && (
						<div className="flex items-center">
							<Badge variant="secondary" className="px-3 py-1.5">
								{selectedUsers.length} user
								{selectedUsers.length !== 1 ? "s" : ""} selected
							</Badge>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSelectedUsers([])}
								className="ml-2 text-xs text-gray-500 h-7"
							>
								Clear Selection
							</Button>
						</div>
					)}

					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>
										<div className="flex items-center justify-center">
											<input
												type="checkbox"
												checked={
													paginatedProfiles.length > 0 &&
													selectedUsers.length === paginatedProfiles.length
												}
												onChange={handleSelectAll}
												className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer"
											/>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>First Name</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("firstName")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Last Name</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("lastName")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Company</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("company")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Weight</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("weight")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Injuries</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("injuries")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Last Updated</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("lastUpdated")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead className="w-[100px] text-right">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedProfiles.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-24 text-center">
											No physical data records found.
										</TableCell>
									</TableRow>
								) : (
									paginatedProfiles.map((profile) => {
										const user = profile.user;
										const activeInjuries = profile.injuries.filter(
											(injury) =>
												injury.status === "active" ||
												injury.status === "chronic",
										).length;

										return (
											<TableRow key={profile.userId}>
												<TableCell>
													<div className="flex items-center justify-center">
														<input
															type="checkbox"
															checked={selectedUsers.includes(profile.userId)}
															onChange={() => handleSelectUser(profile.userId)}
															className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4 cursor-pointer"
														/>
													</div>
												</TableCell>
												<TableCell>
													<div className="font-medium">{user.firstName}</div>
												</TableCell>
												<TableCell>
													<div className="font-medium">{user.lastName}</div>
												</TableCell>
												<TableCell>
													{"companyId" in user && user.companyId
														? getCompanyName(user.companyId)
														: "System"}
												</TableCell>
												<TableCell>{profile.weight} kg</TableCell>
												<TableCell>
													{profile.injuries.length === 0 ? (
														<span className="text-green-500">None</span>
													) : (
														<div>
															<span
																className={
																	activeInjuries > 0
																		? "text-red-500"
																		: "text-gray-500"
																}
															>
																{profile.injuries.length} total
															</span>
															{activeInjuries > 0 && (
																<div className="text-xs text-red-500">
																	{activeInjuries} active
																</div>
															)}
														</div>
													)}
												</TableCell>
												<TableCell>
													<div className="text-sm">
														{profile.lastUpdated.toLocaleDateString()}
													</div>
													<div className="text-xs text-gray-500">
														{profile.lastUpdated.toLocaleTimeString()}
													</div>
												</TableCell>
												<TableCell>
													<div className="flex justify-end gap-1">
														<Button
															variant="ghost"
															size="icon"
															onClick={() => {
																setSelectedProfile(profile);
																setViewDialogOpen(true);
															}}
															className="h-8 w-8 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
														>
															<Eye className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() => {
																setSelectedProfile(profile);
																setEditDialogOpen(true);
															}}
															className="h-8 w-8 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
														>
															<Pencil className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															onClick={() =>
																console.log("Delete clicked", profile.userId)
															}
															className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination UI */}
					<div className="flex items-center justify-between mt-4 gap-4">
						<div className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0 flex items-center gap-2">
							<span>
								Showing{" "}
								{Math.min(
									filteredProfiles.length,
									(currentPage - 1) * itemsPerPage + 1,
								)}
								-{Math.min(filteredProfiles.length, currentPage * itemsPerPage)}{" "}
								of {filteredProfiles.length}
							</span>
							<div className="flex items-center ml-4">
								<span className="text-sm text-gray-500 mr-2">Show:</span>
								<select
									className="h-8 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-sm"
									value={itemsPerPage}
									onChange={(e) =>
										handleItemsPerPageChange(Number(e.target.value))
									}
								>
									{itemsPerPageOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							</div>
						</div>

						{totalPages > 1 && (
							<Pagination className="flex-grow flex justify-end">
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious
											onClick={() =>
												handlePageChange(Math.max(1, currentPage - 1))
											}
											className={
												currentPage === 1
													? "pointer-events-none opacity-50"
													: "cursor-pointer"
											}
										/>
									</PaginationItem>

									{getPageNumbers().map((page) => (
										<PaginationItem
											key={typeof page === "number" ? `page-${page}` : page}
										>
											{page === "ellipsis-start" || page === "ellipsis-end" ? (
												<PaginationEllipsis />
											) : (
												<PaginationLink
													isActive={page === currentPage}
													onClick={() => handlePageChange(page as number)}
													className="cursor-pointer"
												>
													{page}
												</PaginationLink>
											)}
										</PaginationItem>
									))}

									<PaginationItem>
										<PaginationNext
											onClick={() =>
												handlePageChange(Math.min(totalPages, currentPage + 1))
											}
											className={
												currentPage === totalPages
													? "pointer-events-none opacity-50"
													: "cursor-pointer"
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						)}
					</div>
				</div>
			</CardContent>
			<ViewPhysicalStatsDialog
				profile={selectedProfile}
				open={viewDialogOpen}
				onOpenChange={setViewDialogOpen}
			/>
			<EditPhysicalStatsDialog
				profile={selectedProfile}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				onSave={handleSaveProfile}
			/>
		</Card>
	);
};

export default PhysicalStatsAdminView;
