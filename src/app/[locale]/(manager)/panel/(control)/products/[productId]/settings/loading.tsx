import { CardSkeleton } from "@/components/skeletons/card";
import { FormSkeleton } from "@/components/skeletons/form";

export default function Loading() {
	return (
		<section className="flex flex-col gap-y-5">
			<div className="flex flex-col md:flex-row gap-5">
				<div className="w-full max-w-sm flex flex-col">
					<CardSkeleton />
				</div>

				<div className="w-full flex flex-col">
					<FormSkeleton max={4} />
				</div>
			</div>
		</section>
	);
}
