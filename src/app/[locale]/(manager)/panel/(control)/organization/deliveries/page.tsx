import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Protect } from "@clerk/nextjs";
import { NoPermission } from "@/components/page/no-permission";

export default function OrganizationDeliveries({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = useTranslations("organization");

	return (
		<Protect
			permission="org:organization:deliveries"
			fallback={<NoPermission />}
		>
			<section>
				<header className="flex flex-col space-y-3 mb-5">
					<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
						{_("organization_deliveries")}
					</h1>

					<p>{_("deliveries_des")}</p>
				</header>
				Working
			</section>
		</Protect>
	);
}
