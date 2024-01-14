import { cn } from "@/lib/utils";
import {
	Activity,
	AreaChart,
	Globe2,
	Layers,
	LayoutList,
	LayoutTemplate,
	RefreshCcwDot,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function Features() {
	const _ = useTranslations("landing");

	return (
		<section className="w-full flex flex-col items-center justify-center py-10">
			<header className="w-full min-h-[250px] flex py-10 flex-col space-y-4 justify-center items-center relative">
				<h1 className="text-3xl md:text-4xl font-bold tracking-wider text-pretty mb-5 max-w-screen-sm text-center">
					{_("features_title")}
				</h1>
				<p className="text-lg max-w-prose text-muted-foreground text-justify">
					{_("features_description")}
				</p>
			</header>

			<div className="flex flex-col items-center space-y-10">
				<FeatureImageItem
					title={_("features_list.real_time_stats.title")}
					des={_("features_list.real_time_stats.des")}
					image={
						<img src="/features/dashboard_page.png" alt="Dashboard page" />
					}
				>
					<div className="flex flex-col space-y-5 py-4">
						<KeyFeature
							title={_("features_list.real_time_stats.key.monitoring.title")}
							des={_("features_list.real_time_stats.key.monitoring.des")}
							icon={<Activity />}
						/>
						<KeyFeature
							title={_("features_list.real_time_stats.key.any_place.title")}
							des={_("features_list.real_time_stats.key.any_place.des")}
							icon={<Globe2 />}
						/>
					</div>
				</FeatureImageItem>
				<FeatureImageItem
					reverse
					title={_("features_list.gestion_inventario.title")}
					des={_("features_list.gestion_inventario.des")}
					image={
						<img src="/features/inventories_page.png" alt="Inventory page" />
					}
				>
					<div className="flex flex-col space-y-5 py-4">
						<KeyFeature
							title={_(
								"features_list.gestion_inventario.key.auto_update.title"
							)}
							des={_("features_list.gestion_inventario.key.auto_update.des")}
							icon={<RefreshCcwDot />}
						/>
						<KeyFeature
							title={_("features_list.gestion_inventario.key.stock.title")}
							des={_("features_list.gestion_inventario.key.stock.des")}
							icon={<Layers />}
						/>
					</div>
				</FeatureImageItem>

				<FeatureImageItem
					title={_("features_list.promocion.title")}
					des={_("features_list.promocion.des")}
					image={<img src="/features/products_page.png" alt="Product page" />}
				>
					<div className="flex flex-col space-y-5 py-4">
						<KeyFeature
							title={_("features_list.promocion.key.profile.title")}
							des={_("features_list.promocion.key.profile.des")}
							icon={<LayoutTemplate />}
						/>
						<KeyFeature
							title={_("features_list.promocion.key.products.title")}
							des={_("features_list.promocion.key.products.des")}
							icon={<LayoutList />}
						/>
						<KeyFeature
							title={_("features_list.promocion.key.metricas.title")}
							des={_("features_list.promocion.key.metricas.des")}
							icon={<AreaChart />}
						/>
					</div>
				</FeatureImageItem>
			</div>
		</section>
	);
}

const KeyFeature = ({
	title,
	des,
	icon,
}: {
	title: string;
	des: string;
	icon: JSX.Element;
}) => {
	return (
		<div className="w-full flex items-start gap-3">
			<div className="w-12 h-12 bg-foreground text-primary-foreground rounded-full justify-center items-center flex shrink-0">
				{icon}
			</div>

			<div className="w-full flex flex-col space-y-2">
				<h3 className="text-base font-semibold">{title}</h3>
				<p className="text-xs text-secondary-foreground">{des}</p>
			</div>
		</div>
	);
};

const FeatureImageItem = ({
	title,
	des,
	children,
	reverse,
	image,
}: {
	title: string;
	des: string;
	children?: React.ReactNode;
	reverse?: boolean;
	image: JSX.Element;
}) => {
	return (
		<div
			className={cn(
				"flex flex-col w-full gap-10 p-10 justify-between items-center",
				{
					"lg:flex-row": !reverse,
					"lg:flex-row-reverse": reverse,
				}
			)}
		>
			<div className="w-full max-w-screen-md border rounded-lg overflow-hidden">
				{image}
			</div>

			<div className="flex flex-col px-4 max-w-prose space-y-5 justify-center items-start">
				<h2 className="text-4xl tracking-wider text-balance font-bold flex items-center relative">
					<div className="w-2 h-12 bg-cyan-700 rounded block m-2 shrink-0"></div>
					{title}
				</h2>
				<p className="text-lg text-justify flex flex-col">{des}</p>

				{children}
			</div>
		</div>
	);
};
