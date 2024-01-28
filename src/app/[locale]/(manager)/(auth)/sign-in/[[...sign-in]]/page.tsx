import { CardSkeleton } from "@/components/skeletons/card";
import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Page({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<>
			<ClerkLoaded>
				<SignIn
					path={`/${locale}/sign-in`}
					appearance={{
						elements: {
							card: "shadow-none",
						},
					}}
					afterSignInUrl={"/panel/dashboard"}
				/>
			</ClerkLoaded>
			<ClerkLoading>
				<div className="w-full max-w-[450px] h-full max-h-[450px]">
					<CardSkeleton />
				</div>
			</ClerkLoading>
		</>
	);
}
