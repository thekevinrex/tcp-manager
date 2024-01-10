import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const CardSkeleton = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Skeleton className="h-6 w-4/5 mb-3 rounded-md" />
				</CardTitle>
				<div className="flex flex-col space-y-2">
					<Skeleton className="h-3 w-2/3" />
					<Skeleton className="h-3 w-2/3" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col space-y-3 mt-5">
					<Skeleton className="w-[70%] h-10" />
					<Skeleton className="w-[50%] h-8" />
					<Skeleton className="w-[40%] h-6" />
				</div>
			</CardContent>
		</Card>
	);
};
