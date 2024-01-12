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

const fontSans = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: SITE.name,
		template: `%s - ${SITE.name}`,
	},
	description: SITE.description,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={cn("min-h-screen antialiased", fontSans.className)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextTopLoader />
					<AuthProvider>{children}</AuthProvider>
					<Toaster />
					<Analytics />
					<SpeedInsights />
				</ThemeProvider>
			</body>
		</html>
	);
}
