import React from "react";
import { Skeleton } from "../ui/skeleton";

export function DataTableSkeleton({ max = 5 }: { max?: number }) {
	return (
		<div className="w-full border px-2 pt-2 rounded-md my-5">
			<table className="min-w-full divide-y">
				<thead>
					<tr>
						<th className="py-2">
							<Skeleton className="w-[20px] h-5 py-2" />
						</th>
						<th className="py-2">
							<Skeleton className="w-[80px] h-5 py-2" />
						</th>
						<th className="py-2">
							<Skeleton className="w-[80px] h-5 py-2" />
						</th>
						<th className="py-2">
							<Skeleton className="w-[80px] h-5 py-2" />
						</th>
						<th className="py-2">
							<Skeleton className="w-[150px] h-3 py-2" />
						</th>
						<th className="py-2">
							<Skeleton className="w-[80px] h-3 py-2" />
						</th>
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: max }).map((_, index) => (
						<tr key={index}>
							<td className="py-4">
								<Skeleton className="w-[20px] h-6 rounded-3xl" />
							</td>
							<td className="py-4">
								<Skeleton className="w-[80px] h-6 rounded-3xl" />
							</td>
							<td className="py-4">
								<Skeleton className="w-[80px] h-6 rounded-3xl" />
							</td>
							<td className="py-4">
								<Skeleton className="w-[150px] h-6 rounded-3xl" />
							</td>
							<td className="py-4">
								<Skeleton className="w-[80px] h-6 rounded-3xl" />
							</td>
							<td className="py-4">
								<Skeleton className="w-[150px] h-6 rounded-3xl" />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
