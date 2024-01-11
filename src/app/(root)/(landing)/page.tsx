"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
	return (
		<div className="flex w-full min-h-screen justify-center items-center bg-slate-300">
			<div className="flex justify-center flex-col items-center space-y-5">
				<div className="text-3xl md:text-6xl px-4 text-white py-2 rounded-md bg-gradient-to-r from-purple-500 to-slate-600 pb-4 w-fit">
					TCP Manager
				</div>
				<h1 className="text-2xl md:text-5xl font-semibold tracking-wide text-pretty text-center max-w-screen-lg">
					Simplifica la gestión de inventarios y potencia tus resultados
				</h1>

				<div className="text-4xl flex font-semibold py-5">
					<TypeAnimation
						preRenderFirstString={true}
						sequence={[
							800,
							"Gestión de inventario en tiempo real",
							800,
							"Promocion productos y organizacion",
							800,
							"Análisis de datos",
							800,
							"Automatización de procesos",
						]}
						speed={55}
						repeat={Infinity}
					/>
				</div>

				<div className="flex gap-x-5 justify-center">
					<Button asChild>
						<Link href={"/organizations"}>Explora las organizaciones</Link>
					</Button>

					<Button asChild variant={"ghost"}>
						<Link href={"/products"}>Explora los products</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
