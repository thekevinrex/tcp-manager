import { FetchFailedError } from "@/components/error/FetchFailed";
import { getSolicitudByKey } from "@/fetchs/organization";
import { SignUp } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
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

	const solicitud = await getSolicitudByKey(solicitudKey);

	if (solicitud.error) {
		return <FetchFailedError error={solicitud.error} />;
	}

	if (!solicitud.data || solicitud.data.user !== null) {
		return <NeedSolicitudKey />;
	}

	return (
		<SignUp
			initialValues={{ emailAddress: solicitud.data.email }}
			afterSignUpUrl={"/panel/org-create"}
			path={`/${locale}/sign-up`}
		/>
	);
}
