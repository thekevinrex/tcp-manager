import { ClerkImage } from "@/components/Image";
import { FormErrors } from "@/components/error/FormErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganization } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormStatus } from "react-dom";

export function OrganizationClerk({ errors }: { errors: any }) {
	const { organization } = useOrganization();
	const _ = useTranslations("organization");

	const { pending } = useFormStatus();

	return (
		<>
			<div className="flex flex-row">
				<div className="flex flex-col justify-start items-center">
					<div className="size-[100px] relative rounded-md overflow-hidden">
						<ClerkImage
							src={organization?.imageUrl || null}
							alt={organization?.name || ""}
						/>
					</div>
				</div>

				<div className="flex flex-col p-3">
					<label className="flex flex-col gap-y-3 text-sm">
						{_("org_image")}
						<Input
							disabled={pending}
							accept="image/*"
							type="file"
							name="image"
						/>

						<FormErrors errors={errors} id="formdata" />
					</label>
				</div>
			</div>

			<label className="flex flex-col gap-y-2 text-xs">
				{_("org_name")}
				<Input
					disabled={pending}
					defaultValue={organization?.name}
					name="name"
					placeholder={_("org_name")}
				/>
			</label>
			<FormErrors errors={errors} id="name" />

			<label className="flex flex-col gap-y-2 text-xs">
				{_("org_slug")}
				<Input
					disabled={pending}
					name="slug"
					defaultValue={organization?.slug || ""}
					placeholder={_("org_slug")}
				/>
			</label>
			<FormErrors errors={errors} id="slug" />

			<div>
				<Button disabled={pending}>
					{pending ? <Loader2 className="animate-spin" /> : _("save")}
				</Button>
			</div>
		</>
	);
}
