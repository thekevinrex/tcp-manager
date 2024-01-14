import { useTranslations } from "next-intl";
import Link from "next/link";

export function Logo() {
	const _ = useTranslations("header");

	return (
		<Link
			href={"/"}
			className="text-lg font-bold w-auto shrink-0 flex text-pretty tracking-wider"
		>
			{_("name")}
		</Link>
	);
}
