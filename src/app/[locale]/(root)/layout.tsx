import { NextIntlClientProvider, useMessages } from "next-intl";
import { Header } from "./_components/header";
import { unstable_setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/page/footer";

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
		<>
			<NextIntlClientProvider
				messages={{ header: message.header, landing: message.landing }}
			>
				<header className="w-full flex flex-row justify-center fixed top-0 left-0 bg-background z-50">
					<Header />
				</header>
			</NextIntlClientProvider>

			<main className="flex flex-col w-full">
				{children}

				<NextIntlClientProvider
					messages={{ footer: message.footer, header: message.header }}
				>
					<Footer />
				</NextIntlClientProvider>
			</main>
		</>
	);
}
