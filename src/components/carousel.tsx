import {
	Carousel,
	CarouselContent,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselReel({ children }: { children: React.ReactNode }) {
	return (
		<Carousel
			opts={{
				align: "start",
			}}
			className="w-full col-span-full"
		>
			<CarouselContent>{children}</CarouselContent>
			<CarouselPrevious className="hidden sm:flex" />
			<CarouselNext className="hidden sm:flex" />
		</Carousel>
	);
}
