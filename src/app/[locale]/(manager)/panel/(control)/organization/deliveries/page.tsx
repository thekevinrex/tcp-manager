import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

export default function OrganizationDeliveries({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = useTranslations("organization");

	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
					{_("organization_deliveries")}
				</h1>

				<p>{_("deliveries_des")}</p>
			</header>
			Working
		</section>
	);
}
