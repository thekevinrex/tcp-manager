import { OrganizationList, Protect, SignedIn } from "@clerk/nextjs";

import { PageHeader } from "./_components/page-header";

const ListOrg = () => {
	return (
		<div className="grid place-content-center w-full h-full min-h-screen">
			<OrganizationList afterSelectPersonalUrl={"/"} />
		</div>
	);
};

export default async function ProductLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SignedIn>
			<Protect permission="org:dashboard:access" fallback={<ListOrg />}>
				<div className="w-full overflow-hidden layouts-container gap-6 p-0 sm:p-6">
					<header className="[grid-area:header] border rounded-md sticky top-0 left-0 bg-white dark:bg-slate-900 h-14 z-50">
						<PageHeader />
					</header>

					{children}
				</div>
			</Protect>
		</SignedIn>
	);
}
