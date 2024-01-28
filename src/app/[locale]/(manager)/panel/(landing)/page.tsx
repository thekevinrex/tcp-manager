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
			<section className="flex flex-col w-full relative">
				<div className="absolute inset-0 top-16 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]">
					<div className="absolute bottom-0 left-0 right-0 top-0 dark:bg-[radial-gradient(circle_500px_at_50%_200px,#0a3a55,transparent)] bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
				</div>

				<HeroSection />
			</section>

			<div className="flex flex-col relative">
				<div className="sticky top-16 -z-10 w-full h-[500px] bg-white dark:bg-slate-950">
					<div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
				</div>

				<div className="flex flex-col -mt-[450px]">
					<Features />
				</div>
			</div>

			<Testimonials />

			<section className="flex w-full justify-center mb-10 my-24">
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
