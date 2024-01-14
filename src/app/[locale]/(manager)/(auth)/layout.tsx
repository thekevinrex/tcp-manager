import { NextIntlClientProvider, useMessages } from "next-intl";
import { Header } from "../_components/header";
import { unstable_setRequestLocale } from "next-intl/server";

export default function AuthLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const message = useMessages();

	return (
		<NextIntlClientProvider
			messages={{ header: message.header, landing: message.landing }}
		>
			<header className="w-full flex flex-row justify-center fixed top-0 left-0 bg-background">
				<Header />
			</header>

			<main className="grid place-content-center w-full h-full min-h-screen">
				{children}
			</main>
		</NextIntlClientProvider>
	);
}
