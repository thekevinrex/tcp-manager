"use client";

import { useOrganization } from "@clerk/nextjs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Organization() {
	const { organization } = useOrganization();

	if (!organization) {
		return;
	}

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>Organization</CardTitle>
				<CardDescription>
					The information of the actual organization that you are actualy. Each
					organization is like a sell point in wich you cand add products and
					sell them
				</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="flex flex-col space-y-3 mb-5">
					<div className="flex justify-between items-center">
						<span className="text-sm text-muted-foreground text-pretty text-ellipsis">
							Organization Name:
						</span>
						<span className="font-semibold">{organization.name}</span>
					</div>
				</div>

				<Button variant={"ghost"} asChild>
					<Link href="/panel/organization">Settings</Link>
				</Button>
			</CardContent>
		</Card>
	);
}

export default Organization;
