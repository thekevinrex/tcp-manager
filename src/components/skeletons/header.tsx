import ContentLoader from "react-content-loader";
import { Skeleton } from "../ui/skeleton";

export const Organizationskeleton = () => (
	<div className="flex space-x-6 items-center">
		<Skeleton className="w-10 h-10 rounded-xl" />
		<Skeleton className="h-8 rounded-md w-[150px]" />
	</div>
);

export const AvatarSkeleton = () => {
	return <Skeleton className="w-10 h-10 rounded-full" />;
};
