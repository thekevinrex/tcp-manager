"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

export const CardFetchError = ({ error }: { error?: string }) => {
	const { refresh } = useRouter();

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{error ? error : "An error occurred while fetching data"}
				</CardTitle>
				<CardDescription>
					This probabily occurred becouse the conection, try to refresh the page
					to solved or leave a comment in sugestions
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center justify-center">
				<Image
					src={"/no_conexion.png"}
					width={150}
					height={150}
					alt="No conexion image"
				/>
				<Button onClick={() => refresh()}>Reload page</Button>
			</CardContent>
		</Card>
	);
};
