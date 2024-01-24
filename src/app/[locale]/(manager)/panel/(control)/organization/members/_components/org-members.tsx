"use client";

import { ClerkImage } from "@/components/Image";
import { AlertModal } from "@/components/dialog";
import { Modal } from "@/components/modal";
import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ROLES } from "@/config/site";
import { formatDate } from "@/lib/utils";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { Edit, Loader2, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

export function OrgMembers() {
	const _ = useTranslations("organization");

	const { userId, has } = useAuth();
	const { memberships, isLoaded } = useOrganization({
		memberships: {
			infinite: true,
		},
	});

	if (!isLoaded || !userId || memberships?.isLoading) {
		return <DataTableSkeleton />;
	}

	return (
		<div className="w-full rounded-md border mt-6">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{_("member")}</TableHead>
						<TableHead>{_("rol")}</TableHead>
						<TableHead>{_("unido")}</TableHead>
						<TableHead>{_("actions")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{memberships?.count && memberships?.count > 0 ? (
						memberships.data.map((row) => {
							return (
								<TableRow key={row.id}>
									<TableCell>
										<div className="flex">
											<div className="flex flex-col items-center justify-start shrink-0">
												<div className="size-14 relative flex items-center justify-center rounded-full overflow-hidden">
													<ClerkImage
														src={row.publicUserData.imageUrl}
														alt={row.publicUserData.identifier}
													/>
												</div>
											</div>
											<div className="flex flex-col px-2 gap-y-2 justify-center items-start">
												{row.publicUserData.userId === userId && (
													<Badge>{_("you")}</Badge>
												)}
												<span>{row.publicUserData.identifier}</span>
											</div>
										</div>
									</TableCell>
									<TableCell>{_(row.role)}</TableCell>
									<TableCell>
										{formatDate({ f: row.createdAt, t: false })}
									</TableCell>
									<TableCell className="space-x-3">
										{userId !== row.publicUserData.userId &&
											has({ permission: "org:sys_memberships:manage" }) && (
												<>
													<EditMember
														role={row.role}
														userId={row.publicUserData.userId || ""}
														membership={memberships}
													/>
													<DeleteMember
														userId={row.publicUserData.userId || ""}
														membership={memberships}
													/>
												</>
											)}
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell className="h-24 text-center">
								{_("no_members")}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

const EditMember = ({
	membership,
	role,
	userId,
}: {
	membership: any;
	role: string;
	userId: string;
}) => {
	const _ = useTranslations("organization");
	const [open, setOpen] = useState(false);
	const [rol, setRol] = useState(role);
	const [loading, setLoading] = useState(false);

	const { organization } = useOrganization();

	const handleEdit = () => {
		setOpen(false);
		setLoading(true);
		organization
			?.updateMember({
				role: rol,
				userId,
			})
			.then(() => {
				if (membership && membership.revalidate) {
					membership.revalidate();
				}
			})
			.catch(() => {
				toast.error(_("error"));
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<Modal
			open={open}
			openChange={(open: boolean) => setOpen(open)}
			trigger={
				<DialogTrigger asChild>
					<Button variant={"secondary"} type="button" disabled={loading}>
						{loading ? <Loader2 className="animate-spin" /> : <Edit />}
					</Button>
				</DialogTrigger>
			}
			title={_("edit_member")}
			description={_("edit_member_des")}
		>
			<Select value={rol} onValueChange={(value: string) => setRol(value)}>
				<SelectTrigger>
					<SelectValue placeholder={_("rol")} />
				</SelectTrigger>
				<SelectContent>
					{ROLES.map((rol) => {
						return (
							<SelectItem key={rol.value} value={rol.value}>
								{_(rol.label)}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>

			<DialogFooter>
				<DialogClose>{_("cancel")}</DialogClose>
				<Button onClick={handleEdit}>{_("save")}</Button>
			</DialogFooter>
		</Modal>
	);
};

const DeleteMember = ({
	membership,
	userId,
}: {
	membership: any;
	userId: string;
}) => {
	const _ = useTranslations("organization");
	const [loading, setLoading] = useState(false);
	const { organization } = useOrganization();

	const handleDelete = () => {
		setLoading(true);

		organization
			?.removeMember(userId)
			.then(() => {
				if (membership && membership.revalidate) {
					membership.revalidate();
				}
			})
			.catch(() => {
				toast.error(_("error"));
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<AlertModal
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant={"destructive"} disabled={loading}>
						{loading ? <Loader2 className="animate-spin" /> : <Trash />}
					</Button>
				</AlertDialogTrigger>
			}
			title={_("member_remove")}
			description={_("member_remove_des")}
			onAction={handleDelete}
		/>
	);
};
