/* eslint-disable @next/next/no-img-element */
import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";

import Link from "@/components/link";
import { Button } from "@/components/ui/button";

export default async function OrgChangePage({
	params: { locale, org },
}: {
	params: { locale: string; org: string };
}) {
	unstable_setRequestLocale(locale);

	const { orgId, userId } = auth();

	if (!userId) {
		redirect(`/${locale}`);
	}

	if (!orgId) {
		redirect(`/${locale}/panel/org-selection`);
	}

	if (org !== orgId) {
		redirect(`/${locale}/panel/org-selection`);
	}

	const response = await db.organization.findUnique({
		where: {
			org: org,
		},
	});

	if (!response) {
		return <NoOrganization />;
	}

	redirect(`/${locale}/panel/dashboard`);
}

const NoOrganization = () => {
	const _ = useTranslations("organization");

	return (
		<>
			<div className="flex flex-col gap-y-5 items-center">
				<div className="max-w-xs flex items-center justify-center relative">
					<img src="/no_data.svg" alt="No data" className="w-full h-auto" />
				</div>

				<h1 className="text-3xl md:text-5xl font-bold">
					{_("no_organization")}
				</h1>

				<p className="max-w-prose ">{_("no_organization_des")}</p>
				<p className="max-w-prose text-sm text-muted-foreground">
					{_("no_organization_des_2")}
				</p>

				<div className="flex justify-center">
					<Button variant={"outline"} asChild>
						<Link href={"/panel/org-selection"}>{_("select_org")}</Link>
					</Button>
				</div>
			</div>

			<div className="fixed bottom-2 left-2 text-sm text-muted-foreground">
				<a href="https://www.freepik.com/free-vector/no-data-concept-illustration_8961448.htm#query=no%20data&position=3&from_view=keyword&track=ais&uuid=381ffadc-67fe-4709-859f-13c7017cd2b1">
					Image by storyset
				</a>{" "}
				on Freepik
			</div>
		</>
	);
};
