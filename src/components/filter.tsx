"use client";

import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export function Filter({ name }: { name: string }) {
	const patname = usePathname();
	const params = useSearchParams();
	const { replace } = useRouter();

	const handleSearch = useDebounce((search: string) => {
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

	return (
		<div className="flex w-full py-5">
			<Input
				placeholder={name}
				onChange={(e) => handleSearch(e.target.value)}
				defaultValue={params.get("q") || ""}
				name="search"
			/>
		</div>
	);
}

export default Filter;
