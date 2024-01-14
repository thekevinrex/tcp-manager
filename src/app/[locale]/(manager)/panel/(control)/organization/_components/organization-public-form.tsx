"use client";

import { useState } from "react";
import { OrganizationBody } from "./organization-body";
import { useAction } from "@/hooks/useAction";
import { organization } from "@/actions/organization";
import toast from "react-hot-toast";
import { Organization } from "@prisma/client";
import { useTranslations } from "next-intl";

export function OrganizationPublicForm({ org }: { org: Organization }) {
	const _ = useTranslations("organization");

	const [domicilio, setDomicilio] = useState<boolean>(
		org !== null ? org.domicilio : true
	);
	const [visible, setVisible] = useState<boolean>(
		org !== null ? org.visible : false
	);

	const { execute, fieldErrors } = useAction(organization, {
		onSuccess: () => {
			toast.success(_("org_updated_successfully"));
		},
		onError: (err: string) => {
			toast.error(err);
		},
	});

	const onSubmit = (formdata: FormData) => {
		const description = formdata.get("description") as string;
		const location = formdata.get("location") as string;
		const phone = formdata.get("phone") as string;
		const domicilio_details = formdata.get("domicilio_details") as string;

		execute({
			domicilio,
			domicilio_details,
			visible,
			description,
			phone,
			location,
		});
	};

	return (
		<form action={onSubmit} className="flex flex-col w-full md:max-w-[80%]">
			<OrganizationBody
				org={org}
				errors={fieldErrors}
				visible={visible}
				handleVisible={(value: boolean) => setVisible(value)}
				domicilio={domicilio}
				handleDomicilio={(value: boolean) => setDomicilio(value)}
			/>
		</form>
	);
}
