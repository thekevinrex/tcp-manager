import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { unstable_setRequestLocale } from "next-intl/server";

export default function SolicitarPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);

	return (
		<section className="mb-32 bg-neutral-50 text-center dark:bg-slate-900 lg:text-left mt-16">
			<div className="px-6 py-12 md:px-12">
				<div className="grid items-center gap-12 lg:grid-cols-2">
					<div className="mt-12 lg:mt-0">
						<h1 className="mb-12 text-5xl font-bold leading-tight tracking-tight">
							The best offer <br />
							<span className="text-sky-700">for your business</span>
						</h1>
						<p className="text-neutral-600 dark:text-neutral-200">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
							itaque accusantium odio, soluta, corrupti aliquam quibusdam
							tempora at cupiditate quis eum maiores libero veritatis? Dicta
							facilis sint aliquid ipsum atque?
						</p>
					</div>
					<div className="mb-12 lg:mb-0">
						<Card>
							<CardHeader>
								<CardTitle>Solicitar</CardTitle>
								<CardDescription>
									Rellena el formulario para hacer una solicitud para poder
									crearte una cuenta
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}
