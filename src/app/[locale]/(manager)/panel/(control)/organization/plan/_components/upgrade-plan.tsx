"use client";

import { Organization } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { upgradePlan } from "@/actions/organizations/upgrade-plan";
import { FormErrors } from "@/components/error/FormErrors";
import { useAction } from "@/hooks/useAction";

export function UpgradePlan({ org }: { org: Organization }) {
	const _ = useTranslations("organization");
	const form = useRef<HTMLFormElement>(null);

	const { fieldErrors, execute } = useAction(upgradePlan, {
		onSuccess: () => {
			toast.success(_("upgreade_successfully"));
			form.current?.reset();
		},
		onError(error) {
			toast.error(error);
		},
	});

	const handleSubmit = (formData: FormData) => {
		const key = formData.get("key") as string;

		execute({ key });
	};

	return (
		<section>
			<Separator className="my-6" />

			<header className="mb-6">
				<h2 className="text-2xl font-bold tracking-tight">
					{_("upgrade_plan")}
				</h2>

				<p>{_("upgrade_des")}</p>
			</header>

			<form action={handleSubmit} ref={form} className="space-y-4">
				<UpgradeBody errors={fieldErrors} />
			</form>
		</section>
	);
}

const UpgradeBody = ({ errors }: { errors: any }) => {
	const _ = useTranslations("organization");
	const { pending } = useFormStatus();

	return (
		<>
			<label>
				{_("upgrade_key")}
				<Input disabled={pending} name="key" placeholder={_("upgrade_key")} />
			</label>
			<FormErrors id="key" errors={errors} />

			<Button disabled={pending}>
				{pending ? <Loader2 className="animate-spin" /> : _("actualizar")}
			</Button>
		</>
	);
};
