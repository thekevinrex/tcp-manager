import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "@/components/link";

export function HeroSection() {
	const _ = useTranslations("home");

	return (
		<section className="mt-16 mb-5 overflow-hidden relative">
			<div className="absolute -z-[1] inset-0 bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

			<div className="py-24 px-6 text-center ">
				<h1 className="mt-2 mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
					{_("hero_section.before_br")}
					<br />
					<span className="text-sky-600">{_("hero_section.after")}</span>
				</h1>
				<Button asChild className="m-2">
					<Link href={"/products"}>{_("explore_products")}</Link>
				</Button>
				<Button asChild variant={"secondary"} className="m-2">
					<Link href={"/organizations"}>{_("explore_organizations")}</Link>
				</Button>
			</div>
		</section>
	);
}
