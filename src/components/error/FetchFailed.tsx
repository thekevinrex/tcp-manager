/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

export const FetchFailedError = ({ error }: { error?: string }) => {
	const pathname = usePathname();

	const message = pathname.startsWith("/en")
		? "An error has occurred"
		: "Lo sentimos ha occurrido un error";

	return (
		<div className="min-h-[550px] flex flex-col items-center justify-center space-y-5">
			<div className="relative max-w-sm">
				<img
					src={"/no_conexion.svg"}
					className="w-full h-auto"
					alt="No conexion image"
				/>
				<div className="text-xs text-center my-3 text-muted-foreground absolute left-0 right-0 bottom-0">
					<a href="https://www.freepik.com/free-vector/offline-concept-illustration_18352146.htm">
						Image by storyset
					</a>{" "}
					on Freepik
				</div>
			</div>

			<h1 className="font-bold tracking-widest text-3xl">
				{error ? error : message}
			</h1>
		</div>
	);
};
