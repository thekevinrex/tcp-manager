"use client";

import { orgInvitation } from "@/actions/organizations/invitations/create";
import { FormErrors } from "@/components/error/FormErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ROLES } from "@/config/site";
import { useAction } from "@/hooks/useAction";
import { useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

export function OrgInvite({
	invitations,
	loaded,
}: {
	invitations: any;
	loaded: boolean;
}) {
	const _ = useTranslations("organization");

	const form = useRef<HTMLFormElement>(null);

	const { execute, fieldErrors } = useAction(orgInvitation, {
		onSuccess: () => {
			form.current?.reset();
			if (invitations && invitations.revalidate) {
				invitations?.revalidate();
			}
			toast.success(_("invitation_sended_successfully"));
		},
		onError(error) {
			toast.error(error);
		},
	});

	if (!loaded || invitations?.isLoading) {
		return <Skeleton className="w-[100px] h-10" />;
	}

	const handleSubmit = (formData: FormData) => {
		const email = formData.get("email") as string;
		const rol = formData.get("rol") as string;

		execute({ email, rol });
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button type="button">{_("invite")}</Button>
			</PopoverTrigger>
			<PopoverContent side="left" align="start">
				<form
					action={handleSubmit}
					ref={form}
					className="flex flex-col gap-y-4"
				>
					<h3 className="text-lg">{_("invite")}</h3>
					<InviteBody errors={fieldErrors} />
				</form>
			</PopoverContent>
		</Popover>
	);
}

const InviteBody = ({ errors }: { errors: any }) => {
	const _ = useTranslations("organization");
	const { pending } = useFormStatus();

	const [role, setRole] = useState<string>("org:admin");

	return (
		<>
			<label className="flex flex-col gap-y-2 text-xs">
				{_("email")}
				<Input
					disabled={pending}
					required
					name="email"
					placeholder={_("email")}
				/>
			</label>

			<FormErrors errors={errors} id="email" />

			<label className="flex flex-col gap-y-2 text-xs">
				{_("rol")}
				<input type="hidden" required name="rol" value={role} />
				<Select
					value={role}
					required
					onValueChange={(value: string) => setRole(value)}
				>
					<SelectTrigger>
						<SelectValue placeholder={_("rol")} />
					</SelectTrigger>
					<SelectContent>
						{ROLES.map((role) => {
							return (
								<SelectItem key={role.value} value={role.value}>
									{_(role.label)}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</label>

			<FormErrors errors={errors} id="rol" />

			<div>
				<Button disabled={pending}>
					{pending ? <Loader2 className="animate-spin" /> : _("invite")}
				</Button>
			</div>
		</>
	);
};
