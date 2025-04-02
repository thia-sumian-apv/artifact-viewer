import { useEffect, useRef, useState } from "react";
import { mockUsers } from "../mocks/userData";
import { mockCompanyData } from "../mocks/companyData";
import { mockCohorts, mockSubcohorts } from "../mocks/cohortData";
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
import type { UserRole } from "..";
import { Card, CardContent } from "@/components/ui/card";
import { ViewUserDialog } from "./users/ViewUserDialog";
import { EditUserDialog, type userFormSchema } from "./users/EditUserDialog";
import type { z } from "zod";
import { dummyCourseData } from "../mocks/courseData";
import { AddUserDialog } from "./users/AddUserDialog";

const UserRoleLabels: Record<UserRole, string> = {
	superAdmin: "Super Admin",
	companyAdmin: "Company Admin",
	courseCommander: "Course Commander",
	courseTrainer: "Course Trainer",
	trainee: "Trainee",
};

const UsersTab = () => {
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

	const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "ascending" | "descending";
	} | null>(null);

	const [selectedUser, setSelectedUser] = useState<
		(typeof mockUsers)[0] | null
	>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [addDialogOpen, setAddDialogOpen] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Add handler for new user
	const handleAddUser = (values: z.infer<typeof userFormSchema>) => {
		console.log("New user:", values);
		// Implement your create user logic here
		setAddDialogOpen(false);
	};

	const roles: UserRole[] = [
		"superAdmin",
		"companyAdmin",
		"courseCommander",
		"courseTrainer",
		"trainee",
	];

	// Add handler for edit
	const handleEditSave = (values: z.infer<typeof userFormSchema>) => {
		console.log("Updated user:", values);
		// Implement your update logic here
		setEditDialogOpen(false);
	};

	// Add role badge color mapping
	const roleBadgeVariants: Record<UserRole, string> = {
		superAdmin: "destructive",
		companyAdmin: "default",
		courseCommander: "secondary",
		courseTrainer: "outline",
		trainee: "secondary",
	};

	const toggleRole = (role: UserRole) => {
		if (selectedRoles.includes(role)) {
			setSelectedRoles(selectedRoles.filter((r) => r !== role));
		} else {
			setSelectedRoles([...selectedRoles, role]);
		}
	};

	// Associate users with company names
	const usersWithCompany = mockUsers.map((user) => {
		let companyName = "System";
		let cohortName = "-";
		let subcohortName = "-";

		if ("companyId" in user && user.companyId) {
			const company = mockCompanyData.find((c) => c.id === user.companyId);
			if (company) {
				companyName = company.name;
			}
		}

		// Get cohort and subcohort info for applicable user roles
		if ("subcohortId" in user && user.subcohortId) {
			const subcohort = mockSubcohorts.find((s) => s.id === user.subcohortId);
			if (subcohort) {
				subcohortName = subcohort.name;
				const cohort = mockCohorts.find((c) => c.id === subcohort.cohortId);
				if (cohort) {
					cohortName = cohort.name;
				}
			}
		}

		return {
			...user,
			companyName,
			cohortName,
			subcohortName,
		};
	});

	// Sorting function
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

	const sortedUsers = [...usersWithCompany].sort((a, b) => {
		if (!sortConfig) return 0;

		let aValue: string;
		let bValue: string;

		switch (sortConfig.key) {
			case "firstName":
				aValue = a.firstName;
				bValue = b.firstName;
				break;
			case "lastName":
				aValue = a.lastName;
				bValue = b.lastName;
				break;
			case "email":
				aValue = a.email;
				bValue = b.email;
				break;
			case "role":
				aValue = a.role;
				bValue = b.role;
				break;
			case "company":
				aValue = a.companyName;
				bValue = b.companyName;
				break;
			case "cohort":
				aValue = a.cohortName;
				bValue = b.cohortName;
				break;
			case "subcohort":
				aValue = a.subcohortName;
				bValue = b.subcohortName;
				break;
			default:
				return 0;
		}

		if (sortConfig.direction === "ascending") {
			return aValue.localeCompare(bValue);
		}
		return bValue.localeCompare(aValue);
	});

	const filteredUsers = sortedUsers.filter((user) => {
		// Apply search filter
		const searchMatch =
			searchQuery === "" ||
			`${user.firstName} ${user.lastName}`
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.companyName.toLowerCase().includes(searchQuery.toLowerCase());

		// Apply role filter
		const roleMatch =
			selectedRoles.length === 0 ||
			selectedRoles.includes(user.role as UserRole);

		return searchMatch && roleMatch;
	});

	const paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

	// Handle page change
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

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

	return (
		<Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
			<CardContent className="pt-6">
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold">User Management</h2>
						<div className="flex items-center gap-2">
							<div
								className={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-64" : "w-8"}`}
							>
								{isSearchExpanded ? (
									<div className="relative w-full">
										<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
										<Input
											ref={searchInputRef}
											placeholder="Search users..."
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
							<Button
								variant="default"
								size="sm"
								className="flex items-center gap-1"
								onClick={() => setAddDialogOpen(true)}
							>
								Add New User
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="flex items-center gap-1"
							>
								<Upload className="h-4 w-4" />
								Import
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="flex items-center gap-1"
							>
								<Download className="h-4 w-4" />
								Export
							</Button>
						</div>
					</div>
					<div className="flex flex-wrap gap-2 items-center">
						<div className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
							Filter by role:
						</div>
						{roles.map((role) => (
							<Badge
								key={role}
								variant={
									selectedRoles.includes(role)
										? (roleBadgeVariants[role] as
												| "default"
												| "destructive"
												| "outline"
												| "secondary")
										: "outline"
								}
								className={`px-3 py-1 cursor-pointer ${
									selectedRoles.includes(role)
										? ""
										: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
								}`}
								onClick={() => toggleRole(role)}
							>
								{UserRoleLabels[role]}
							</Badge>
						))}
						{selectedRoles.length > 0 && (
							<Button
								variant="ghost"
								size="sm"
								className="h-7 text-xs text-gray-500"
								onClick={() => setSelectedRoles([])}
							>
								Clear All
							</Button>
						)}
					</div>
					<div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[120px]">
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
									<TableHead className="w-[120px]">
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
											<span>Email</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("email")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead className="w-[120px]">
										<div className="flex justify-between items-center">
											<span>Role</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("role")}
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
									<TableHead className="w-[160px]">
										<div className="flex justify-between items-center">
											<div className="text-xs">
												<div className="font-medium">Cohort</div>
												<div className="text-gray-500">Subcohort</div>
											</div>
											<Button
												variant="ghost"
												onClick={() => requestSort("cohort")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedUsers.length === 0 ? (
									<TableRow>
										<TableCell colSpan={8} className="h-24 text-center">
											No users found.
										</TableCell>
									</TableRow>
								) : (
									paginatedUsers.map((user) => (
										<TableRow key={user.id}>
											<TableCell>
												<span className="font-medium">{user.firstName}</span>
											</TableCell>
											<TableCell>{user.lastName}</TableCell>
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
											<TableCell>{user.companyName}</TableCell>
											<TableCell>
												{user.cohortName !== "-" ? (
													<div className="text-xs">
														<div className="font-medium">{user.cohortName}</div>
														{user.subcohortName !== "-" && (
															<div className="text-gray-500">
																{user.subcohortName}
															</div>
														)}
													</div>
												) : (
													<span className="text-gray-400 text-sm">-</span>
												)}
											</TableCell>
											<TableCell>
												<div className="flex justify-end gap-1">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => {
															setSelectedUser(user);
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
															setSelectedUser(user);
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
															console.log("Delete clicked", user.id)
														}
														className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
					{/* Pagination UI */}
					<div className="flex items-center justify-between mt-4 gap-4">
						<div className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
							Showing{" "}
							{Math.min(
								filteredUsers.length,
								(currentPage - 1) * itemsPerPage + 1,
							)}
							-{Math.min(filteredUsers.length, currentPage * itemsPerPage)} of{" "}
							{filteredUsers.length}
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
			<AddUserDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				roles={roles}
				userRoleLabels={UserRoleLabels}
				courses={dummyCourseData}
				subcohorts={mockSubcohorts}
				onSave={handleAddUser}
			/>
			<ViewUserDialog
				user={selectedUser}
				open={viewDialogOpen}
				onOpenChange={setViewDialogOpen}
				roleBadgeVariants={roleBadgeVariants}
				userRoleLabels={UserRoleLabels}
			/>
			<EditUserDialog
				user={selectedUser}
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				roles={roles}
				userRoleLabels={UserRoleLabels}
				onSave={handleEditSave}
				courses={dummyCourseData}
				subcohorts={mockSubcohorts}
			/>
		</Card>
	);
};

export default UsersTab;
