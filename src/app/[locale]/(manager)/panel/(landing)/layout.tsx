import { NextIntlClientProvider, useMessages } from "next-intl";
import { Header } from "../../_components/header";
import { Footer } from "@/components/page/footer";
import { unstable_setRequestLocale } from "next-intl/server";

export default function ProductLayout({
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
			messages={{
				header: message.header,
				landing: message.landing,
				footer: message.footer,
			}}
		>
			<header className="w-full flex flex-row justify-center fixed top-0 left-0 bg-background z-50">
				<Header />
			</header>

			<main className="flex flex-col w-full">
				{children}
				<Footer />
			</main>
		</NextIntlClientProvider>
	);
}
