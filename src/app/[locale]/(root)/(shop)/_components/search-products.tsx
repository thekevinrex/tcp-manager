"use client";
import InfiniteScroll from "react-infinite-scroll-component";

import { ProductReelItem } from "@/components/page/product-reel-item";
import { ReelSkeletonItem } from "@/components/skeletons/reel";
import { ProductsWithPrices } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function SearchProducts({
	org,
	q,
	filters,
}: {
	org?: string;
	q: string;
	filters: string[];
}) {
	const _ = useTranslations("home");

	const [product, setProducts] = useState<ProductsWithPrices[]>([]);
	const [more, setMore] = useState(true);
	const [lastId, setLastId] = useState<null | number>(0);

	const getProducts = () => {
		fetch(`/api/products?lastId=${lastId}&q=${q}&org=${org ? org : ""}`)
			.then(async (response) => {
				if (response.status !== 200) {
					setMore(false);
					toast.error(_("fetch_error"));
					return;
				}

				const json: { products: Array<ProductsWithPrices> } =
					await response.json();

				if (json.products.length === 0) {
					setLastId(null);
					setMore(false);
				} else {
					setProducts((prev) => [...prev, ...json.products]);
					const lastProduct = json.products.pop();

					setLastId(lastProduct?.id || null);
				}
			})
			.catch(() => {
				setMore(false);
				toast.error(_("fetch_error"));
			});
	};

	return (
		<InfiniteScroll
			dataLength={product.length}
			next={getProducts}
			hasMore={more}
			loader={<Loading />}
			endMessage={<NoMore />}
			scrollThreshold={0.5}
		>
			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{product.map((product) => {
					return <ProductReelItem key={product.id} {...product} />;
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
