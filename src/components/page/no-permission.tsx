/* eslint-disable @next/next/no-img-element */
import { auth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export function NoPermission() {
	const _ = useTranslations("organization");

	const { orgRole } = auth();

	return (
		<div className="flex flex-col items-center justify-center min-h-[550px]">
			<div className="flex flex-col items-center gap-y-5">
				<div className="max-w-sm flex relative">
					<img
						src="/no_permission.svg"
						alt="No permission image"
						className="w-full h-auto"
					/>

					<div className="absolute left-0 right-0 bottom-0 text-center text-xs text-muted-foreground">
						<a href="https://www.freepik.com/free-vector/enter-sign-concept-illustration_23849442.htm#query=no%20permission&position=6&from_view=search&track=ais&uuid=0acfb5a3-aaad-4396-944f-f1effe45b193">
							Image by storyset
						</a>{" "}
						on Freepik
					</div>
				</div>

				<h1 className="text-2xl md:text-4xl font-bold">{_("no_permission")}</h1>

				<p className="text-center max-w-prose">{_("no_permission_des")}</p>

				<p>
					{_("actual_role")} <strong>{_(orgRole)}</strong>
				</p>
			</div>
		</div>
	);
}
