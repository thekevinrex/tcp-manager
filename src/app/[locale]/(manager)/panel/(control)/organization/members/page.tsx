import {
	NextIntlClientProvider,
	useMessages,
	useTranslations,
} from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { OrgMembers } from "./_components/org-members";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrgInvitations } from "./_components/org-invitations";
import { Protect } from "@clerk/nextjs";
import { NoPermission } from "@/components/page/no-permission";

export default function OrgMembersPage({
	params: { locale },
}: {
	params: { locale: string };
}) {
	unstable_setRequestLocale(locale);
	const _ = useTranslations("organization");
	const messages = useMessages();

	return (
		<Protect permission="org:settings:member" fallback={<NoPermission />}>
			<section>
				<header className="flex flex-col space-y-3 mb-5">
					<h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
						{_("organization_members")}
					</h1>
					<p>{_("members_des")}</p>
				</header>
				<Tabs defaultValue="members">
					<TabsList>
						<TabsTrigger value="members">{_("members")}</TabsTrigger>
						<TabsTrigger value="invitations">{_("invitations")}</TabsTrigger>
					</TabsList>

					<NextIntlClientProvider
						messages={{
							organization: messages.organization,
							alert: messages.alert,
						}}
					>
						<TabsContent value="members">
							<div className="flex flex-col mt-5">
								<div className="flex flex-row justify-between gap-x-3 items-end min-h-10">
									<h2 className="text-xl font-semibold">{_("members")}</h2>
									<div></div>
								</div>
								<OrgMembers />
							</div>
						</TabsContent>
						<TabsContent value="invitations">
							<OrgInvitations />
						</TabsContent>
					</NextIntlClientProvider>
				</Tabs>
			</section>
		</Protect>
	);
}
