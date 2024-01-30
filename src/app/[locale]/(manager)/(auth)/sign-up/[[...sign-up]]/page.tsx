import { SignUp } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";

import { FetchFailedError } from "@/components/error/FetchFailed";
import { getSolicitudByKey } from "@/fetchs/organization";

import { NeedSolicitudKey } from "./need-solicitud-key";

export default async function Page({
	params: { locale },
	searchParams: { solicitud: solicitudKey },
}: {
	params: { locale: string };
	searchParams: { solicitud?: string };
}) {
	unstable_setRequestLocale(locale);

	if (!solicitudKey) {
		return <NeedSolicitudKey />;
	}

	const solicitud = await getSolicitudByKey(solicitudKey || "");

	if (solicitud.error) {
		return <FetchFailedError error={solicitud.error} />;
	}

	if (!solicitud.data || solicitud.data.user !== null) {
		return <NeedSolicitudKey />;
	}

	const link =
		solicitud.data.type === "invitation"
			? `/${locale}/panel/org-selection`
			: `/${locale}/panel/org-create`;

	return (
		<SignUp
			initialValues={{ emailAddress: solicitud.data.email }}
			afterSignUpUrl={link}
			appearance={{
				elements: {
					card: "shadow-none",
				},
			}}
			path={`/${locale}/sign-up`}
		/>
	);
}
