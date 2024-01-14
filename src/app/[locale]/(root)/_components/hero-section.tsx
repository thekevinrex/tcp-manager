import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function HeroSection() {
	const _ = useTranslations("home");

	return (
		<section className="my-10 overflow-hidden relative">
			<div className="bg-neutral-200 py-24 px-6 text-center dark:bg-slate-900">
				<h1 className="mt-2 mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
					{_("hero_section.before_br")}
					<br />
					<span className="text-primary">{_("hero_section.after")}</span>
				</h1>
				<Button asChild className="m-2">
					<Link href={"/products"}>{_("explore_products")}</Link>
				</Button>
				<Button asChild variant={"secondary"} className="m-2">
					<Link href={"/organizations"}>{_("explore_organizations")}</Link>
				</Button>
			</div>

			<div className="fill-white dark:fill-background bg-fo md:-mt-4 lg:-mt-6 xl:-mt-10 h-[50px] scale-[2] origin-[top_center] w-full flex overflow-hidden items-start absolute  bottom-0 left-0 right-0">
				<svg
					viewBox="0 0 2880 48"
					className="block w-full h-full"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M 0 48 L 1437.5 48 L 2880 48 L 2880 0 L 2160 0 C 1453.324 60.118 726.013 4.51 720 0 L 0 0 L 0 48 Z"></path>
				</svg>
			</div>
		</section>
	);
}
