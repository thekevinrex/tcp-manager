import { useTranslations } from "next-intl";
import { Features } from "./_components/features";
import { HeroSection } from "./_components/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Testimonials } from "./_components/testimonials";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Home({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const _ = useTranslations("landing");

	return (
		<>
			<section className="flex flex-col w-full overflow-hidden relative">
				<HeroSection />

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

			<Features />

			<Testimonials />

			<section className="flex w-full justify-center mb-10">
				<div className="min-h-[320px] w-full max-w-screen-xl bg-sky-700 dark:bg-sky-950 rounded-lg p-14 flex justify-center items-center mb-10 flex-col space-y-6">
					<h1 className="md:text-5xl text-white text-3xl font-black text-pretty tracking-widest">
						{_("ready_to_start")}
					</h1>

					<Button asChild variant={"secondary"} size={"lg"}>
						<Link href={"/panel/solicitar"}>{_("solicitar_cuenta")}</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
