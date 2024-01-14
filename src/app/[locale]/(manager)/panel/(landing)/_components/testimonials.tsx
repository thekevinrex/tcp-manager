import { useTranslations } from "next-intl";

export function Testimonials() {
	const _ = useTranslations("landing");

	return (
		<div className="container my-24 mx-auto md:px-6">
			<section className="mb-32 text-center">
				<h2 className="mb-12 text-3xl font-bold">{_("testimonials_title")}</h2>

				<div className="grid gap-x-6 md:grid-cols-3 lg:gap-x-12 justify-between ">
					<TestimonialCard
						img={
							<img
								src="/testimonials/dra_yillian.jpg"
								className="w-32 rounded-full shadow-lg dark:shadow-black/20"
								alt={_("testimonials.dra.alt")}
							/>
						}
						name={_("testimonials.dra.name")}
						ocupation={_("testimonials.dra.ocupation")}
						testimonio={_("testimonials.dra.testimonio")}
					/>

					<TestimonialCard
						img={
							<img
								src="/testimonials/tcp_importador.jpg"
								className="w-32 rounded-full shadow-lg dark:shadow-black/20"
								alt={_("testimonials.tcp_transportador.alt")}
							/>
						}
						name={_("testimonials.tcp_transportador.name")}
						ocupation={_("testimonials.tcp_transportador.ocupation")}
						testimonio={_("testimonials.tcp_transportador.testimonio")}
					/>
				</div>
			</section>
		</div>
	);
}

const TestimonialCard = ({
	img,
	name,
	ocupation,
	testimonio,
}: {
	img: JSX.Element;
	name: string;
	ocupation: string;
	testimonio: string;
}) => {
	return (
		<div className="mb-12 md:mb-0">
			<div className="mb-6 flex justify-center">{img}</div>
			<h5 className="mb-2 text-lg font-bold tracking-wider text-pretty">
				{name}
			</h5>
			<h6 className="mb-4 font-semibold text-sky-600 dark:text-sky-800">
				{ocupation}
			</h6>
			<p className="mb-4 text-sm text-center text-pretty tracking-wider">
				{testimonio}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 96 960 960"
					className="inline-block w-6"
				>
					<path
						fill="currentColor"
						d="M580 556h160V396H580v160Zm-360 0h160V396H220v160Zm406 220 80-160H520V336h280v288l-76 152h-98Zm-360 0 80-160H160V336h280v288l-76 152h-98Zm34-300Zm360 0Z"
					/>
				</svg>
			</p>
		</div>
	);
};
