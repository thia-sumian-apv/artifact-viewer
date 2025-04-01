import { useEffect, useRef, useState } from "react";
import { Eye, Pencil, Trash2, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockCompanyData } from "../mocks/companyData";
import { AddCompanyDialog } from "./companies/AddCompanyDialog";
import { ViewCompanyDialog } from "./companies/ViewCompanyDialog";
import { EditCompanyDialog } from "./companies/EditCompanyDialog";
import { format } from "date-fns";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Company } from "../types/company";

const CompaniesTab = () => {
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [companies, setCompanies] = useState(mockCompanyData);
	const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

	// Add search functionality
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Add sorting configuration
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: "ascending" | "descending";
	} | null>(null);

	// Handle outside click for search
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

	// Apply sorting to companies
	const sortedCompanies = [...companies].sort((a, b) => {
		if (!sortConfig) return 0;

		// For string comparisons
		switch (sortConfig.key) {
			case "name":
			case "shortName":
			case "registrationNumber":
			case "status": {
				const aStr =
					sortConfig.key === "name"
						? a.name
						: sortConfig.key === "shortName"
							? a.shortName
							: sortConfig.key === "registrationNumber"
								? a.registrationNumber
								: a.status;
				const bStr =
					sortConfig.key === "name"
						? b.name
						: sortConfig.key === "shortName"
							? b.shortName
							: sortConfig.key === "registrationNumber"
								? b.registrationNumber
								: b.status;
				return sortConfig.direction === "ascending"
					? aStr.localeCompare(bStr)
					: bStr.localeCompare(aStr);
			}

			case "licenses": {
				const aRatio = a.usedLicenses / a.maxLicenses;
				const bRatio = b.usedLicenses / b.maxLicenses;
				return sortConfig.direction === "ascending"
					? aRatio - bRatio
					: bRatio - aRatio;
			}

			case "id": {
				return sortConfig.direction === "ascending"
					? a.id.localeCompare(b.id)
					: b.id.localeCompare(a.id);
			}

			default:
				return 0;
		}
	});

	// Apply search filter
	const filteredCompanies = sortedCompanies.filter((company) => {
		return (
			searchQuery === "" ||
			company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			company.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			company.registrationNumber
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
	});

	const handleDelete = (id: string) => {
		const company = companies.find((c) => c.id === id);
		if (company) {
			setSelectedCompany(company);
			setDeleteDialogOpen(true);
		}
	};

	const confirmDelete = () => {
		if (selectedCompany) {
			setCompanies(
				companies.filter((company) => company.id !== selectedCompany.id),
			);
			toast.success(`${selectedCompany.name} deleted successfully`);
			setDeleteDialogOpen(false);
		}
	};

	const handleView = (id: string) => {
		const company = companies.find((c) => c.id === id);
		if (company) {
			setSelectedCompany(company);
			setViewDialogOpen(true);
		}
	};

	const handleEdit = (id: string) => {
		const company = companies.find((c) => c.id === id);
		if (company) {
			setSelectedCompany(company);
			setEditDialogOpen(true);
		}
	};

	const handleSaveEdit = (updatedCompany: Company) => {
		setCompanies(
			companies.map((company) =>
				company.id === updatedCompany.id ? updatedCompany : company,
			),
		);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<CardTitle>Manage Companies</CardTitle>
					<div className="flex items-center gap-2">
						<div
							className={`relative transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-64" : "w-8"}`}
						>
							{isSearchExpanded ? (
								<div className="relative w-full">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
									<Input
										ref={searchInputRef}
										placeholder="Search companies..."
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
						<Button onClick={() => setAddDialogOpen(true)}>Add Company</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>ID</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("id")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Company Name</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("name")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Short Name</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("shortName")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Registration Number</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("registrationNumber")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Status</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("status")}
												className="ml-2 h-8 w-8 p-0"
											>
												<ArrowUpDown className="h-4 w-4" />
											</Button>
										</div>
									</TableHead>
									<TableHead>Subscription</TableHead>
									<TableHead>
										<div className="flex justify-between items-center">
											<span>Licenses</span>
											<Button
												variant="ghost"
												onClick={() => requestSort("licenses")}
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
								{filteredCompanies.length > 0 ? (
									filteredCompanies.map((company) => (
										<TableRow key={company.id}>
											<TableCell className="text-muted-foreground text-sm font-mono">
												{company.id.substring(0, 8)}
											</TableCell>
											<TableCell className="font-medium">
												<div className="flex items-center gap-2">
													{company.name}
												</div>
											</TableCell>
											<TableCell>{company.shortName}</TableCell>
											<TableCell>{company.registrationNumber}</TableCell>
											<TableCell>
												<Badge
													variant={
														company.status === "active"
															? "default"
															: "destructive"
													}
													className={`capitalize ${company.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}`}
												>
													{company.status}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex flex-col">
													<span className="text-sm">
														{format(company.subscriptionStart, "dd/MM/yyyy")}
													</span>
													<span className="text-xs ">
														to {format(company.subscriptionEnd, "dd/MM/yyyy")}
													</span>
												</div>
											</TableCell>
											<TableCell>
												<span className="text-sm">
													{company.usedLicenses} / {company.maxLicenses}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-1">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleView(company.id)}
														className="h-8 w-8 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
													>
														<Eye className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleEdit(company.id)}
														className="h-8 w-8 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
													>
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => handleDelete(company.id)}
														className="h-8 w-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={7} className="h-24 text-center">
											No companies found. Click "Add Company" to create one.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Dialogs */}
			<AddCompanyDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

			{selectedCompany && (
				<>
					<ViewCompanyDialog
						open={viewDialogOpen}
						onOpenChange={setViewDialogOpen}
						company={selectedCompany}
						onEdit={(id) => {
							setViewDialogOpen(false);
							setTimeout(() => handleEdit(id), 100);
						}}
					/>

					<EditCompanyDialog
						open={editDialogOpen}
						onOpenChange={setEditDialogOpen}
						company={selectedCompany}
						onSave={handleSaveEdit}
					/>

					<AlertDialog
						open={deleteDialogOpen}
						onOpenChange={setDeleteDialogOpen}
					>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action will permanently delete {selectedCompany.name}.
									This action cannot be undone. All associated users and courses
									will lose access.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={confirmDelete}
									className="bg-red-600 hover:bg-red-700 text-white"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)}
		</div>
	);
};

export default CompaniesTab;
