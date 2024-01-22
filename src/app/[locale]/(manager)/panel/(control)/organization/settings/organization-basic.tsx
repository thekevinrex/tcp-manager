"use client";

import { useOrganization } from "@clerk/nextjs";

import { FormSkeleton } from "@/components/skeletons/form";
import { OrganizationClerk } from "./_components/organization-clerk";
import { useAction } from "@/hooks/useAction";
import { clerkOrganization } from "@/actions/organizations/clerk";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export function OrganizationBasic() {
	const { isLoaded, organization } = useOrganization();
	const _ = useTranslations("organization");
	const form = useRef<HTMLFormElement>(null);

	const { execute, fieldErrors } = useAction(clerkOrganization, {
		onSuccess: () => {
			form.current?.reset();
			toast.success(_("org_updated_successfully"));
			organization?.reload();
		},
		onError(error) {
			toast.error(error);
		},
	});

	if (!isLoaded) {
		return <FormSkeleton max={2} />;
	}

	const handleSubmit = (formData: FormData) => {
		const name = formData.get("name") as string;
		const slug = formData.get("slug") as string;

		execute({ name, slug, formdata: formData });
	};

	return (
		<form action={handleSubmit} ref={form} className="flex flex-col gap-y-5">
			<OrganizationClerk errors={fieldErrors} />
		</form>
	);
}
