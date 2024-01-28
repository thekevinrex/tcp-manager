import { NextIntlClientProvider, useMessages } from "next-intl";
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
		<NextIntlClientProvider messages={{ landing: message.landing }}>
			<main className="grid place-content-center w-full h-full min-h-screen">
				{children}
			</main>
		</NextIntlClientProvider>
	);
}
