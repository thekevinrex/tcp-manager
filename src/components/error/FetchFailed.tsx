"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export const FetchFailedError = ({
	error,
	reset,
}: {
	error?: string;
	reset?: () => void;
}) => {
	const pathname = usePathname();

	const message = pathname.startsWith("/en")
		? "An error has occurred"
		: "Lo sentimos ha occurrido un error";

	return (
		<div className="min-h-[550px] flex flex-col items-center justify-center space-y-5">
			<Image
				src={"/no_conexion.png"}
				width={150}
				height={150}
				alt="No conexion image"
			/>

			<h1 className="font-bold tracking-widest text-3xl">
				{error ? error : message}
			</h1>

			{reset && (
				<Button variant={"secondary"} onClick={() => reset()}>
					Try again
				</Button>
			)}
		</div>
	);
};
