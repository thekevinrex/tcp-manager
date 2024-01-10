import Link from "next/link";

export function Logo() {
	return (
		<Link
			href={"/"}
			className="text-lg font-bold w-auto shrink-0 flex text-pretty tracking-wider"
		>
			TCP Shop
		</Link>
	);
}
