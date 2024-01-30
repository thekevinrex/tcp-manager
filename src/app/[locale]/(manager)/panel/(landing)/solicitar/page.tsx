import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { SolicitarForm } from "./_components/solicitar-form";

export default function SolicitarPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	const _ = useTranslations("solicitar");
	const messages = useMessages();

	return (
		<section className="mb-32 text-center  lg:text-left mt-16 relative">
			<div className="absolute -z-[1] inset-0 bg-white dark:bg-slate-950 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

			<div className="px-6 py-12 md:px-12">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div className="mt-12 lg:mt-0">
						<h1 className="mb-12 text-5xl font-bold leading-tight tracking-tight text-center">
							{_("hero_section.before_br")} <br />
							<span className="text-sky-700">{_("hero_section.after")}</span>
						</h1>
						<p className="text-neutral-600 dark:text-neutral-200">
							{_("hero_section_des")}
						</p>
					</div>
					<div className="mb-12 lg:mb-0 flex justify-center">
						<NextIntlClientProvider
							messages={{
								solicitar: messages.solicitar,
								fieldsErrors: messages.fieldsErrors,
							}}
						>
							<SolicitarForm />
						</NextIntlClientProvider>
					</div>
				</div>
			</div>
		</section>
	);
}
