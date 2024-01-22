import { SignIn } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Page({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<SignIn path={`/${locale}/sign-in`} afterSignInUrl={"/panel/dashboard"} />
	);
}
