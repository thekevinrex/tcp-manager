"use client";

import { TypeAnimation } from "react-type-animation";
import { useTranslations } from "next-intl";

import Link from "@/components/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
	const _ = useTranslations("landing");

	return (
		<div className="flex w-full min-h-screen justify-center items-center ">
			<div className="flex justify-center flex-col items-center space-y-5">
				<header className="flex flex-col items-center space-y-5 justify-center">
					<div className="text-3xl md:text-6xl px-4 text-white py-2 rounded-md bg-gradient-to-r dark:from-purple-800 dark:to-slate-600 from-purple-600 to-purple-400 pb-4 w-fit">
						{_("name")}
					</div>
					<h1 className="text-2xl md:text-5xl font-semibold tracking-wide text-pretty text-center max-w-screen-lg">
						{_("slogan")}
					</h1>
				</header>

				<div className="text-2xl md:text-4xl flex font-semibold py-5">
					<TypeAnimation
						preRenderFirstString={true}
						sequence={[
							800,
							_("features.first"),
							800,
							_("features.second"),
							800,
							_("features.third"),
							800,
							_("features.fourth"),
						]}
						speed={55}
						repeat={Infinity}
					/>
				</div>

				<div className="flex gap-x-5 justify-center">
					<Button asChild size={"lg"}>
						<Link href={"/panel/solicitar"}>{_("hero_action")}</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
