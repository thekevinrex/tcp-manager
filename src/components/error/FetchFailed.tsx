"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export const FetchFailedError = ({ error }: { error?: string }) => {
	const { refresh } = useRouter();

	return (
		<div className="min-h-[550px] flex flex-col items-center justify-center space-y-5">
			<Image
				src={"/no_conexion.png"}
				width={150}
				height={150}
				alt="No conexion image"
			/>

			<h1 className="font-bold tracking-widest text-3xl">
				{error ? error : "An error occurred while fetching data"}
			</h1>

			<p>
				This probabily occurred becouse the conection, try to refresh the page
				to solved or leave a comment in sugestions
			</p>

			<Button onClick={() => refresh()}>Reload page</Button>
		</div>
	);
};
