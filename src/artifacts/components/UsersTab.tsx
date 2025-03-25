import { useEffect, useRef, useState } from "react";
import { mockUsers } from "../mocks/userData";
import { mockCompanyData } from "../mocks/companyData";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
	Search,
	ArrowUpDown,
	Download,
	Upload,
	Pencil,
	Eye,
	Trash2,
	Plus,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { UserRole } from "..";
import { Card, CardContent } from "@/components/ui/card";
import { ViewUserDialog } from "./users/ViewUserDialog";
import { EditUserDialog, type userFormSchema } from "./users/EditUserDialog";
import type { z } from "zod";
import { dummyCourseData } from "../mocks/courseData";
import { mockSubcohorts } from "../mocks/cohortData";
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

	const [_deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [_userToDelete, setUserToDelete] = useState<string | null>(null);

	// Add delete handler
	const handleDelete = (userId: string) => {
		setUserToDelete(userId);
		setDeleteDialogOpen(true);
	};

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

		if ("companyId" in user && user.companyId) {
			const company = mockCompanyData.find((c) => c.id === user.companyId);
			if (company) {
				companyName = company.name;
			}
		}

		return {
			...user,
			companyName,
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
			case "name":
				aValue = `${a.firstName} ${a.lastName}`;
				bValue = `${b.firstName} ${b.lastName}`;
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
								<Plus className="h-4 w-4" />
								Add User
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
									<TableHead className="w-[250px]">
										<Button
											variant="ghost"
											onClick={() => requestSort("name")}
											className="font-semibold flex items-center"
										>
											Name
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead>
										<Button
											variant="ghost"
											onClick={() => requestSort("email")}
											className="font-semibold flex items-center"
										>
											Email
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead>
										<Button
											variant="ghost"
											onClick={() => requestSort("role")}
											className="font-semibold flex items-center"
										>
											Role
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead>
										<Button
											variant="ghost"
											onClick={() => requestSort("company")}
											className="font-semibold flex items-center"
										>
											Company
											<ArrowUpDown className="ml-2 h-4 w-4" />
										</Button>
									</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredUsers.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="h-24 text-center">
											No users found.
										</TableCell>
									</TableRow>
								) : (
									filteredUsers.map((user) => (
										<TableRow key={user.id}>
											<TableCell className="flex items-center gap-3">
												<Avatar className="h-8 w-8">
													<AvatarImage
														src=""
														alt={`${user.firstName} ${user.lastName}`}
													/>
													<AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-500 dark:text-teal-300 text-xs">
														{user.firstName[0]}
														{user.lastName[0]}
													</AvatarFallback>
												</Avatar>
												<span className="font-medium">
													{user.firstName} {user.lastName}
												</span>
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
											<TableCell>{user.companyName}</TableCell>
											<TableCell className="text-right">
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
														onClick={() => handleDelete(user.id)}
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

					<div className="text-sm text-gray-500">
						Total users: {filteredUsers.length}
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
