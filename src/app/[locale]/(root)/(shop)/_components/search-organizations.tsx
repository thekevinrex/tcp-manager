"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import toast from "react-hot-toast";
import { Organization } from "@prisma/client";
import { useTranslations } from "next-intl";

import { ReelSkeletonItem } from "@/components/skeletons/reel";
import { OrganizationReelItem } from "@/components/page/organization-reel-item";

export function SearchOrganizations({
	q,
	filters,
}: {
	q: string;
	filters: string[];
}) {
	const _ = useTranslations("home");

	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [more, setMore] = useState(true);
	const [page, setPage] = useState<number>(1);

	const getOrganizations = () => {
		fetch(`/api/organizations?page=${page}&q=${q}`)
			.then(async (response) => {
				if (response.status !== 200) {
					setMore(false);
					toast.error(_("fetch_error"));
					return;
				}

				const json: { organizations: Array<Organization> } =
					await response.json();

				if (json.organizations.length === 0) {
					setMore(false);
				} else {
					setOrganizations((prev) => [...prev, ...json.organizations]);

					setPage((prev) => prev + 1);
				}
			})
			.catch(() => {
				setMore(false);
				toast.error(_("fetch_error"));
			});
	};

	return (
		<InfiniteScroll
			dataLength={organizations.length}
			next={getOrganizations}
			hasMore={more}
			scrollThreshold={0.5}
			loader={<Loading />}
			endMessage={<NoMore />}
		>
			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{organizations.map((organization) => {
					return (
						<OrganizationReelItem key={organization.org} {...organization} />
					);
				})}
			</div>
		</InfiniteScroll>
	);
}

const Loading = () => (
	<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{[...Array(4)].map((num, i) => {
			return <ReelSkeletonItem key={i} />;
		})}
	</div>
);

const NoMore = () => {
	const _ = useTranslations("home");

	return (
		<div className="w-full text-xl font-semibold text-center py-10 px-5">
			{_("no_more")}
		</div>
	);
};
