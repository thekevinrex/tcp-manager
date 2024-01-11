"use client";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { X } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Filter({ name }: { name: string }) {
	const patname = usePathname();
	const params = useSearchParams();
	const { replace } = useRouter();

	const [search, setSearch] = useState(params.get("q") || "");

	const doSearch = useDebounce((search: string) => {
		const url = new URLSearchParams(params);

		if (search) {
			url.set("q", search);
			url.set("page", "1");
		} else {
			url.delete("page");
			url.delete("q");
		}

		replace(`${patname}?${url.toString()}`);
	}, 300);

	const handleSearch = (search: string) => {
		setSearch(search);

		doSearch(search);
	};

	return (
		<div className="flex w-full py-5 relative items-center">
			<Input
				placeholder={name}
				onChange={(e) => handleSearch(e.target.value)}
				value={search}
				name="search"
			/>
			{search && (
				<X
					className="absolute right-4 cursor-pointer"
					onClick={() => handleSearch("")}
				/>
			)}
		</div>
	);
}

export default Filter;
