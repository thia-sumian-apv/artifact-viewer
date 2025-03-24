import { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type { Company } from "../mocks/companyData";
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

const CompaniesTab = () => {
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [companies, setCompanies] = useState(mockCompanyData);
	const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

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
					<Button onClick={() => setAddDialogOpen(true)}>Add Company</Button>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Company Name</TableHead>
									<TableHead>Short Name</TableHead>
									<TableHead>Registration Number</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Subscription</TableHead>
									<TableHead>Licenses</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{companies.length > 0 ? (
									companies.map((company) => (
										<TableRow key={company.id}>
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
													<span className="text-xs text-muted-foreground">
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
