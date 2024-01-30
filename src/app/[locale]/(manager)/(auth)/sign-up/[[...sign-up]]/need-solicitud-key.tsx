/* eslint-disable @next/next/no-img-element */
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import Link from "@/components/link";

export function NeedSolicitudKey() {
	const _ = useTranslations("solicitar");
	return (
		<div className="flex flex-col gap-y-5 max-w-lg items-center">
			<div className="max-w-[250px] relative">
				<img
					src="/no_key.svg"
					className="w-full h-auto"
					alt="Men holding a key"
				/>
				<div className="absolute left-0 bottom-0 text-xs text-muted-foreground right-0 text-center">
					<a href="https://www.freepik.com/free-vector/key-concept-illustration_13850240.htm">
						Image by storyset
					</a>{" "}
					on Freepik
				</div>
			</div>

			<h1 className="text-2xl md:text-4xl font-bold tracking-wider">
				{_("need_solicitud_key")}
			</h1>
			<p className="text-center">{_("need_solicitud_des")}</p>
			<Button asChild>
				<Link href={"/panel/solicitar"}>{_("solicitar")}</Link>
			</Button>
		</div>
	);
}
