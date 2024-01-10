import Link from "next/link";

import { Button } from "@/components/ui/button";

export const NoAreaCreated = () => (
	<div className="h-full flex justify-center items-center space-y-5 flex-col min-h-[450px]">
		<h2 className="text-2xl font-bold tracking-widest uppercase text-pretty">
			Area no created
		</h2>

		<p>To be able to sells products create a sell area</p>

		<Link href={"/panel/area/create"}>
			<Button type="button">Create area</Button>
		</Link>
	</div>
);
