import { useState } from "react";
import { mockUsers } from "../mocks/userData";
import { User, KeyRound, Building, Users } from "lucide-react";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// For demo, use the same user as PhysicalTab
const USER_ID = "user-008"; // Thomas Garcia

const ProfileTab = () => {
	// Dialog state
	const [showProfileDialog, setShowProfileDialog] = useState(false);
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);

	// Get user data from mock data
	const userData = mockUsers.find((user) => user.id === USER_ID);

	const [profile, setProfile] = useState({
		firstName: userData?.firstName || "",
		lastName: userData?.lastName || "",
		email: userData?.email || "",
		age: userData?.age || 0,
		dateOfBirth: userData?.dateOfBirth
			? new Date(userData.dateOfBirth)
			: new Date(),
		role: userData?.role || "",
		companyId: userData?.companyId || "",
	});

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setProfile((prev) => ({
			...prev,
			[name]: name === "age" ? Number.parseInt(value) || 0 : value,
		}));
	};

	const handlePasswordInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const { name, value } = e.target;
		setPasswordForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSaveProfile = () => {
		// Here you would typically save to a backend
		console.log("Saving profile:", profile);
		setShowProfileDialog(false);
	};

	const handleChangePassword = () => {
		// Validation logic would go here
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			alert("Passwords don't match");
			return;
		}

		console.log("Password change requested:", {
			currentPassword: passwordForm.currentPassword,
			newPassword: passwordForm.newPassword,
		});

		setShowPasswordDialog(false);
		// Reset password fields
		setPasswordForm({
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	};

	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	return (
		<>
			<div className="space-y-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-xl font-bold">
							Profile Information
						</CardTitle>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowProfileDialog(true)}
						>
							Edit Profile
						</Button>
					</CardHeader>

					<CardContent className="pt-4">
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
							<Avatar className="h-20 w-20 bg-muted">
								<AvatarFallback className="text-xl font-semibold">
									{userData
										? getInitials(userData.firstName, userData.lastName)
										: "U"}
								</AvatarFallback>
							</Avatar>

							<div>
								<h3 className="text-xl font-medium">
									{profile.firstName} {profile.lastName}
								</h3>
								<p className="text-sm text-muted-foreground">{profile.email}</p>
								<div className="flex items-center gap-2 mt-1">
									<Badge variant="outline" className="capitalize">
										{profile.role}
									</Badge>
									<span className="text-xs text-muted-foreground">
										Age: {profile.age}
									</span>
								</div>
							</div>
						</div>

						<Separator className="my-4" />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h4 className="text-sm font-medium flex items-center mb-3">
									<Building className="h-4 w-4 mr-2 text-muted-foreground" />
									Organization
								</h4>
								<div className="space-y-2">
									<div className="bg-muted/50 p-3 rounded-md">
										<span className="text-xs text-muted-foreground block">
											Company ID
										</span>
										<span className="text-sm font-medium">
											{userData?.companyId || "Not assigned"}
										</span>
									</div>
									<div className="bg-muted/50 p-3 rounded-md">
										<span className="text-xs text-muted-foreground block">
											Subcohort
										</span>
										<span className="text-sm font-medium">
											{userData && "subcohortId" in userData
												? userData.subcohortId
												: "Not assigned"}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h4 className="text-sm font-medium flex items-center mb-3">
									<User className="h-4 w-4 mr-2 text-muted-foreground" />
									Personal Details
								</h4>
								<div className="space-y-2">
									<div className="bg-muted/50 p-3 rounded-md">
										<span className="text-xs text-muted-foreground block">
											Date of Birth
										</span>
										<span className="text-sm font-medium">
											{formatDate(profile.dateOfBirth)}
										</span>
									</div>
									<div className="bg-muted/50 p-3 rounded-md">
										<span className="text-xs text-muted-foreground block">
											Role
										</span>
										<span className="text-sm font-medium capitalize">
											{profile.role}
										</span>
									</div>
								</div>
							</div>
						</div>

						<Separator className="my-4" />

						<div>
							<h4 className="text-sm font-medium flex items-center mb-3">
								<KeyRound className="h-4 w-4 mr-2 text-muted-foreground" />
								Security
							</h4>
							<Button
								variant="outline"
								onClick={() => setShowPasswordDialog(true)}
								className="w-full sm:w-auto"
							>
								Change Password
							</Button>
						</div>
					</CardContent>
				</Card>

				{userData?.role === "trainee" &&
					userData?.buddyIds &&
					userData.buddyIds.length > 0 && (
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-md font-medium flex items-center">
									<Users className="h-4 w-4 mr-2 text-muted-foreground" />
									Buddy System
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-xs text-muted-foreground mb-3">
									Assigned Buddies
								</p>
								<div className="space-y-3">
									{userData.buddyIds.map((buddyId) => {
										const buddy = mockUsers.find((user) => user.id === buddyId);
										return buddy ? (
											<div
												key={buddyId}
												className="flex items-center space-x-3 bg-muted/50 p-3 rounded-md"
											>
												<Avatar className="h-8 w-8">
													<AvatarFallback className="text-xs">
														{getInitials(buddy.firstName, buddy.lastName)}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="text-sm font-medium">
														{buddy.firstName} {buddy.lastName}
													</p>
													<p className="text-xs text-muted-foreground">
														{buddy.email}
													</p>
												</div>
											</div>
										) : null;
									})}
								</div>
							</CardContent>
						</Card>
					)}
			</div>

			{/* Edit Profile Dialog */}
			<Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Profile</DialogTitle>
						<DialogDescription>
							Update your personal information
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									name="firstName"
									value={profile.firstName}
									onChange={handleProfileInputChange}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									name="lastName"
									value={profile.lastName}
									onChange={handleProfileInputChange}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={profile.email}
								onChange={handleProfileInputChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="age">Age</Label>
							<Input
								id="age"
								name="age"
								type="number"
								className="w-24"
								value={profile.age}
								onChange={handleProfileInputChange}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowProfileDialog(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveProfile}>Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Change Password Dialog */}
			<Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Change Password</DialogTitle>
						<DialogDescription>
							Enter your current password and a new password
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="currentPassword">Current Password</Label>
							<Input
								id="currentPassword"
								name="currentPassword"
								type="password"
								value={passwordForm.currentPassword}
								onChange={handlePasswordInputChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="newPassword">New Password</Label>
							<Input
								id="newPassword"
								name="newPassword"
								type="password"
								value={passwordForm.newPassword}
								onChange={handlePasswordInputChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm New Password</Label>
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								value={passwordForm.confirmPassword}
								onChange={handlePasswordInputChange}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowPasswordDialog(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleChangePassword}>Update Password</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProfileTab;
