import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";

export function AuthLoading({
	children,
	fallback,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}) {
	return (
		<>
			<ClerkLoaded>{children}</ClerkLoaded>
			{fallback && <ClerkLoading>{fallback}</ClerkLoading>}
		</>
	);
}
