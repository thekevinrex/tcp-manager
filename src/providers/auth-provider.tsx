"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { esES, enUS } from "@clerk/localizations";

export function AuthProvider({
	children,
	locale,
}: {
	children: React.ReactNode;
	locale: string;
}) {
	const { resolvedTheme } = useTheme();

	const LocalizationMap: any = {
		es: esES,
		en: enUS,
	};

	return (
		<ClerkProvider
			appearance={{
				baseTheme: resolvedTheme === "light" ? undefined : dark,
			}}
			localization={LocalizationMap[locale]}
		>
			{children}
		</ClerkProvider>
	);
}
