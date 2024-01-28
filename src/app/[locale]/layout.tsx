import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { unstable_setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import "@/app/globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { SITE } from "@/config/site";
import { AuthProvider } from "@/providers/auth-provider";

const fontSans = Inter({
	subsets: ["latin"],
	preload: true,
	weight: ["500", "600", "700"],
});

export async function generateMetadata({
	params: { locale },
}: {
	params: { locale: string };
}) {
	const t = await getTranslations({ locale, namespace: "header" });

	const metadata: Metadata = {
		applicationName: t("name"),
		title: {
			default: t("name"),
			template: `%s - ${t("name")}`,
		},
		description: t("description"),
		keywords: t("keywords"),

		creator: SITE.creator,

		twitter: {
			title: {
				default: t("name"),
				template: `%s - ${t("name")}`,
			},
			description: t("description"),
			images: {
				url: `${process.env.HOST_URL || "http://localhost:3000"}/site-img.png`,
				alt: t("name"),
			},
			// creator: SITE.creator,
		},

		robots: {
			index: false,
			follow: true,
			nocache: true,
			googleBot: {
				index: true,
				follow: false,
				noimageindex: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},

		openGraph: {
			type: "website",
			siteName: t("name"),

			locale: locale,
			alternateLocale: ["es", "en"],

			countryName: SITE.country,
			emails: SITE.emails,
			url: process.env.HOST_URL || "http://localhost:3000",
			title: {
				default: t("name"),
				template: `%s - ${t("name")}`,
			},
			images: [
				{
					width: 800,
					height: 600,
					url: `${
						process.env.HOST_URL || "http://localhost:3000"
					}/site-img.png`,
					alt: t("name"),
				},
			],
			description: t("description"),
		},
	};

	return metadata;
}

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
