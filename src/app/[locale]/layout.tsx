import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "@/app/globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { SITE } from "@/config/site";
import { AuthProvider } from "@/providers/auth-provider";
import { useLocale } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

const fontSans = Inter({
	subsets: ["latin"],
	preload: true,
	weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
	title: {
		default: SITE.name,
		template: `%s - ${SITE.name}`,
	},
	description: SITE.description,
};

// Can be imported from a shared config
const locales = ["en", "es"];

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const locale = params.locale || "es";
	unstable_setRequestLocale(locale);

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={cn("min-h-screen antialiased", fontSans.className)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextTopLoader />
					<AuthProvider locale={locale}>{children}</AuthProvider>
					<Toaster />

					<Analytics />
					<SpeedInsights />
				</ThemeProvider>
			</body>
		</html>
	);
}
