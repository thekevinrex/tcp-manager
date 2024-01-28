"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { solicitarCuenta } from "@/actions/organizations/solicitar";
import toast from "react-hot-toast";
import { FormErrors } from "@/components/error/FormErrors";
import Link from "next/link";

type orgType = "cuenta_propia" | "tcp" | "mypime";

export function SolicitarForm() {
	const form = useRef<HTMLFormElement>(null);
	const _ = useTranslations("solicitar");

	const [orgType, setOrgType] = useState<orgType>("cuenta_propia");

	const { fieldErrors, execute } = useAction(solicitarCuenta, {
		onSuccess: () => {
			toast.success(_("solicitud_created_successfully"));
			form.current?.reset();
			setOrgType("cuenta_propia");
		},
		onError(error) {
			toast.error(error);
		},
	});

	const handleSubmit = (formData: FormData) => {
		const name = formData.get("name") as string;
		const phone = formData.get("phone") as string;

		const email = formData.get("email") as string;
		const proposito = formData.get("proposito") as string;

		execute({ name, email, org_type: orgType, phone, proposito });
	};

	return (
		<Card className="max-w-lg">
			<CardHeader>
				<CardTitle>{_("solicitar")}</CardTitle>
				<CardDescription>{_("solicitar_card_des")}</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					action={handleSubmit}
					ref={form}
					className="flex flex-col gap-y-5"
				>
					<SolicitarBody
						org_type={orgType}
						org_change={(value: orgType) => setOrgType(value)}
						errors={fieldErrors}
					/>
				</form>
			</CardContent>
		</Card>
	);
}

const SolicitarBody = ({
	errors,
	org_type,
	org_change,
}: {
	errors: any;
	org_type: string;
	org_change: (value: orgType) => void;
}) => {
	const { pending } = useFormStatus();
	const _ = useTranslations("solicitar");

	return (
		<>
			<label className="flex flex-col text-xs gap-y-2">
				{_("name")}
				<Input
					disabled={pending}
					name="name"
					required
					placeholder={_("name")}
				/>
			</label>
			<FormErrors id="name" errors={errors} />

			<label className="flex flex-col text-xs gap-y-2">
				{_("proposito")}
				<Textarea
					disabled={pending}
					name="proposito"
					required
					placeholder={_("proposito")}
				/>
			</label>
			<FormErrors id="proposito" errors={errors} />

			<label className="flex flex-col text-xs gap-y-2">
				{_("org_type")}
				<Select
					required
					disabled={pending}
					onValueChange={org_change}
					value={org_type}
				>
					<SelectTrigger disabled={pending}>
						<SelectValue placeholder={_("org_type")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="cuenta_propia">{_("cuenta_propia")}</SelectItem>
						<SelectItem value="tcp">{_("tcp")}</SelectItem>
						<SelectItem value="mypime">{_("mypime")}</SelectItem>
					</SelectContent>
				</Select>
			</label>

			<FormErrors id="org_type" errors={errors} />

			<p className="text-xs text-muted-foreground">
				{_("org_type_help")}{" "}
				<Link
					className="text-sky-600 hover:underline hover:text-sky-700"
					href={"/panel/pricing"}
				>
					{_("pricing")}
				</Link>
			</p>

			<Separator />

			<label className="flex flex-col text-xs gap-y-2">
				{_("email")}
				<Input
					disabled={pending}
					required
					name="email"
					placeholder={_("email")}
				/>
			</label>

			<FormErrors id="email" errors={errors} />

			<label className="flex flex-col text-xs gap-y-2">
				{_("phone")}
				<Input disabled={pending} name="phone" placeholder={_("phone")} />
			</label>

			<Button
				disabled={pending}
				className="flex w-full justify-center text-center"
			>
				{pending ? <Loader2 className="animate-spin" /> : _("solicitar")}
			</Button>
		</>
	);
};
