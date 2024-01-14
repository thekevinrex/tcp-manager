import { SignUp } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Page({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	return (
		<>
			<section>
				<h1>Not allowed to sign up</h1>
			</section>
		</>
	);
}
