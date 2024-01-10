"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { resolvedTheme } = useTheme();

	return (
		<ClerkProvider
			appearance={{
				baseTheme: resolvedTheme === "light" ? undefined : dark,
			}}
		>
			{children}
		</ClerkProvider>
	);
}
