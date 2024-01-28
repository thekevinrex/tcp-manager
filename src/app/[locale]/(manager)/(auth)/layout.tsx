/* eslint-disable @next/next/no-img-element */
import { NextIntlClientProvider, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Navbar } from "./_components/navbar";

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
			<main className="flex w-full min-h-screen">
				<div className="w-full flex flex-row">
					<div className="w-full h-screen justify-center items-center hidden lg:flex sticky top-0">
						<img
							src="/auth-background.webp"
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
					<div className="w-full lg:max-w-xl flex flex-col items-center relative">
						<Navbar />

						<div className="flex p-10 items-center justify-center w-full flex-1">
							{children}
						</div>
					</div>
				</div>
			</main>
		</NextIntlClientProvider>
	);
}
