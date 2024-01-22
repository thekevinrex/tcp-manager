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
		<section className="mb-32 bg-neutral-50 text-center dark:bg-slate-900 lg:text-left mt-16">
			<div className="px-6 py-12 md:px-12">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div className="mt-12 lg:mt-0">
						<h1 className="mb-12 text-5xl font-bold leading-tight tracking-tight text-center">
							{_("hero_section.before_br")} <br />
							<span className="text-sky-700">{_("hero_section.after")}</span>
						</h1>
						<p className="text-neutral-600 dark:text-neutral-200"></p>
					</div>
					<div className="mb-12 lg:mb-0 flex justify-center">
						<NextIntlClientProvider
							messages={{ solicitar: messages.solicitar }}
						>
							<SolicitarForm />
						</NextIntlClientProvider>
					</div>
				</div>
			</div>
		</section>
	);
}
