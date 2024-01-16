import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function Reel({
	title,
	more,
	children,
}: {
	title: JSX.Element;
	more?: { href: string; label: string };
	children: React.ReactNode;
}) {
	return (
		<section className="mb-32 text-center lg:text-left w-full">
			<div className="flex justify-between items-center mb-12">
				<h2 className="text-xl sm:text-3xl font-bold flex gap-x-2 items-center">
					{title}
				</h2>

				{more && (
					<div className="flex items-center shrink-0">
						<Button variant={"outline"}>
							<Link href={more.href} className="flex items-center gap-x-2">
								<span className="hidden sm:block">{more.label}</span>
								<ArrowRight />
							</Link>
						</Button>
					</div>
				)}
			</div>

			{children}
		</section>
	);
}
