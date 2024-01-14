import { NextIntlClientProvider, useTranslations } from "next-intl";
import { AreaNavbar } from "./_components/area-navbar";
import { unstable_setRequestLocale } from "next-intl/server";

export default function AreaLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		areaId: string;
		locale: string;
	};
}) {
	unstable_setRequestLocale(params.locale);
	const _ = useTranslations("areas");

	return (
		<section>
			<header className="flex flex-col space-y-3 mb-5">
				<h1 className="text-4xl font-extrabold tracking-tight">
					{_("sell_area_info")}
				</h1>

				<p>{_("sell_area_info_des")}</p>

				<div>
					<NextIntlClientProvider
						messages={{ labels: { stats: _("stadistics"), sells: _("sells") } }}
					>
						<AreaNavbar area={params.areaId} />
					</NextIntlClientProvider>
				</div>
			</header>

			{children}
		</section>
	);
}
