"use client";

import { DataTableSkeleton } from "@/components/skeletons/data-table";
import { useOrganization } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { AlertModal } from "@/components/dialog";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { revokeInvitation } from "@/actions/organizations/invitations/revoke";
import toast from "react-hot-toast";
import { OrgInvite } from "./org-invite";

export function OrgInvitations() {
	const _ = useTranslations("organization");

	const { invitations, isLoaded } = useOrganization({
		invitations: {
			infinite: true,
		},
	});

	return (
		<div className="flex flex-col mt-5">
			<div className="flex flex-row justify-between gap-x-3 items-end">
				<h2 className="text-xl font-semibold">{_("invitations")}</h2>
				<div>
					<OrgInvite invitations={invitations} loaded={isLoaded} />
				</div>
			</div>
			<InvitationTable invitations={invitations} loading={isLoaded} />
		</div>
	);
}

const InvitationTable = ({
	invitations,
	loading,
}: {
	invitations: any;
	loading: boolean;
}) => {
	const _ = useTranslations("organization");
	const badge = (status: string) => {
		let variante: BadgeProps["variant"] = "default";

		if (status === "accepted") {
			variante = "green";
		} else if (status === "revoked") {
			variante = "destructive";
		}

		return <Badge variant={variante}>{_(status)}</Badge>;
	};

	if (!loading || invitations?.isLoading) {
		return <DataTableSkeleton />;
	}

	return (
		<div className="w-full rounded-md border mt-6">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{_("email")}</TableHead>
						<TableHead>{_("rol")}</TableHead>
						<TableHead>{_("status")}</TableHead>
						<TableHead>{_("invited")}</TableHead>
						<TableHead>{_("actions")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{invitations?.count && invitations?.count > 0 ? (
						invitations.data.map((row: any) => {
							return (
								<TableRow key={row.id}>
									<TableCell>{row.emailAddress}</TableCell>
									<TableCell>{_(row.role)}</TableCell>
									<TableCell>{badge(row.status)}</TableCell>
									<TableCell>
										{formatDate({ f: row.createdAt, t: false })}
									</TableCell>
									<TableCell>
										<RevokeInvitation invitations={invitations} id={row.id} />
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell className="h-24 text-center">
								{_("no_invitations")}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};

const RevokeInvitation = ({
	id,
	invitations,
}: {
	id: string;
	invitations: any;
}) => {
	const _ = useTranslations("organization");

	const { isLoading: loading, execute } = useAction(revokeInvitation, {
		onSuccess() {
			toast.success(_("invitations_revoked_successfully"));
			if (invitations !== undefined && invitations?.revalidate) {
				invitations?.revalidate();
			}
		},
		onError(error) {
			toast.error(error);
			console.error(error);
		},
	});

	const handleAction = () => {
		execute({ id });
	};

	return (
		<AlertModal
			title={_("revoke_invitation")}
			description={_("revoke_invitation_des")}
			trigger={
				<AlertDialogTrigger asChild>
					<Button variant="destructive" disabled={loading}>
						{loading ? <Loader2 className="animate-spin" /> : <Trash />}
					</Button>
				</AlertDialogTrigger>
			}
			onAction={handleAction}
		/>
	);
};
