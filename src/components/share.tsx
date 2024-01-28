import {
	Facebook,
	Instagram,
	Linkedin,
	Mail,
	Share2,
	Twitter,
} from "lucide-react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./ui/drawer";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";

export function Share({ link }: { link: string }) {
	const _ = useTranslations("home");

	const SHARES = [
		{
			name: "facebook",
			icon: <Facebook />,
			link: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
		},
		{
			name: "twitter",
			icon: <Twitter />,
			link: `https://twitter.com/intent/tweet?url=${link}`,
		},
		{
			name: "linkedin",
			icon: <Linkedin />,
			link: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
		},
		{
			name: "Telegram",
			icon: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
				</svg>
			),
			link: `https://t.me/share/url?url=${link}`,
		},
		{
			name: "Instagram",
			icon: <Instagram />,
			link: `https://www.instagram.com/share?url=${link}`,
		},
		{
			name: "whatsapp",
			icon: (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
					<path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
				</svg>
			),
			link: `https://wa.me/?text=${link}`,
		},
		{
			name: _("email"),
			icon: <Mail />,
			link: `mailto:?subject=Check%20this%20out&body=${link}`,
		},
	];

	return (
		<Drawer>
			<DrawerTrigger className="flex items-center justify-center gap-x-2">
				<Share2 /> {_("share")}
			</DrawerTrigger>
			<DrawerContent>
				<div className="flex flex-col justify-center items-center p-4 pb-0 space-y-2">
					<DrawerHeader className="flex flex-col justify-start w-full max-w-sm">
						<DrawerTitle>{_("share")}</DrawerTitle>
						<DrawerDescription>{_("share_des")}</DrawerDescription>
					</DrawerHeader>

					<div className="flex flex-row flex-wrap gap-3 justify-center items-center max-w-sm w-full">
						{SHARES.map((share) => (
							<a
								key={share.name}
								href={share.link}
								target="_blank"
								area-label={share.name}
								className="border rounded-md  items-center justify-center text-sm flex size-16 hover:shadow-lg cursor-pointer"
							>
								{share.icon}
								<span className="sr-only">{share.name}</span>
							</a>
						))}
					</div>

					<DrawerFooter className="flex flex-col gap-y-3 justify-center max-w-sm w-full">
						<DrawerClose asChild>
							<Button variant={"outline"}>{_("close")}</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
