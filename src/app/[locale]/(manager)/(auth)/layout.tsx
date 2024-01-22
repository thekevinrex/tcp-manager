/* eslint-disable @next/next/no-img-element */
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Header } from "../_components/header";
import { unstable_setRequestLocale } from "next-intl/server";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function AuthLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const message = useMessages();

	const { userId, orgId } = auth();

	if (userId && !orgId) {
		return redirect("/panel/org-selection");
	}

	if (userId && orgId) {
		return redirect("/panel/dashboard");
	}

	return (
		<NextIntlClientProvider
			messages={{ header: message.header, landing: message.landing }}
		>
			<header className="w-full flex flex-row justify-center fixed top-0 left-0 bg-background z-50">
				<Header />
			</header>

			<main className="flex w-full h-screen pt-16">
				<div className="w-full flex flex-row">
					<div className="w-full h-full relative justify-center items-center hidden lg:flex">
						<img
							src="/auth-background.jpg"
							alt="woman helmet holding open laptop working"
							className="w-full h-full"
						/>
						<div className="absolute left-2 bottom-2 text-muted-foreground text-sm">
							<a href="https://www.freepik.com/free-photo/woman-helmet-holding-open-laptop-working_20879354.htm">
								Image by zinkevych
							</a>{" "}
							on Freepik
						</div>
					</div>
					<div className="w-full lg:max-w-xl flex flex-col p-10 items-center overflow-x-hidden overflow-y-auto justify-center">
						{children}
					</div>
				</div>
			</main>
		</NextIntlClientProvider>
	);
}
