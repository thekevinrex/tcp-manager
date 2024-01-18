import { unstable_setRequestLocale } from "next-intl/server";

export function SolicitarPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
}
