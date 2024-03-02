"use client";

import { useTranslations } from "next-intl";
import { Facebook, Github, Linkedin, Twitter } from "lucide-react";
import Link from "@/components/link";

import { Logo } from "./logo";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export function Footer() {
	const _ = useTranslations("footer");
	const pathname = usePathname();

	let pathnameWithoutLocale = pathname;

	if (pathname.startsWith("/en")) {
		pathnameWithoutLocale = pathname.slice(3);
	} else if (pathname.startsWith("/es")) {
		pathnameWithoutLocale = pathname.slice(3);
	}

	const locales = [
		// { label: _("en"), locale: "en", link: `/en${pathnameWithoutLocale}` },
		{ label: _("es"), locale: "es", link: `/es${pathnameWithoutLocale}` },
	];

	return (
		<footer>
			<div className="flex justify-center items-center  ">
				<div className="max-w-screen-xl min-h-[250px] flex flex-col md:flex-row gap-5 justify-start w-full px-10">
					<div className="flex flex-col max-md:justify-center max-w-[300px] space-y-7">
						<Logo />

						<h1 className="text-lg text-pretty tracking-wider font-semibold">
							{_("slogan")}
						</h1>

						<SocialIcons />
					</div>

					<div className="w-full flex justify-evenly  max-md:flex-col flex-wrap gap-5 items-start">
						<FooterItem title={_("langs")}>
							{locales.map((locale) => {
								return <FooterLinkItem {...locale} key={locale.link} />;
							})}
						</FooterItem>

						<FooterItem title={_("clients")}>
							<FooterLinkItem label={_("home")} link="/" />
							<FooterLinkItem label={_("products")} link="/products" />
							<FooterLinkItem
								label={_("organizations")}
								link="/organizations"
							/>
						</FooterItem>

						<FooterItem title={_("panel")}>
							<SignedIn>
								<FooterLinkItem
									label={_("dashboard")}
									link="/panel/dashboard"
								/>
								<FooterLinkItem
									label={_("sell_area")}
									link="/panel/sell-area"
								/>
								<FooterLinkItem
									label={_("inventories")}
									link="/panel/inventory"
								/>
								<FooterLinkItem
									label={_("organization")}
									link="/panel/organization"
								/>
							</SignedIn>
							<SignedOut>
								<FooterLinkItem label={_("sign_in")} link="/sign-in" />
								<FooterLinkItem label={_("sign_up")} link="/sign-up" />
								<FooterLinkItem
									label={_("solicitar_cuenta")}
									link="/panel/solicitar"
								/>
							</SignedOut>
						</FooterItem>

						<FooterItem title={_("legal")}>
							<FooterLinkItem label={_("contact_us")} link="/contact" />
							<FooterLinkItem label={_("about_us")} link="/about" />
							<FooterLinkItem label={_("terms_conds")} link="/terms" />
							<FooterLinkItem label={_("privacy")} link="/privacy" />
						</FooterItem>
					</div>
				</div>
			</div>

			<div className="flex justify-center items-center py-3 px-10">
				{_("copyright")}
			</div>
		</footer>
	);
}

const SocialIcons = () => {
	const SocialLinks = [
		{
			icon: <Github />,
			link: "https://github.com/thekevinrex",
		},
		// {
		// 	icon: <Facebook />,
		// 	link: "https://www.facebook.com/",
		// },
		{
			icon: <Linkedin />,
			link: "https://www.linkedin.com/in/kevin-gonzalez-918015241/",
		},
		// {
		// 	icon: <Twitter />,
		// 	link: "https://twitter.com/",
		// },
	];

	return (
		<div className="flex justify-center flex-wrap gap-5">
			{SocialLinks.map((link) => {
				return (
					<a key={link.link} href={link.link} target="_blank">
						<div className="rounded-full p-4 shadow-md hover:border-slate-500 border flex items-center justify-center">
							{link.icon}
						</div>
					</a>
				);
			})}
		</div>
	);
};

const FooterItem = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => {
	return (
		<div className="w-auto h-auto max-w-[300px] flex flex-col">
			<h2 className="text-lg font-bold text-muted-foreground mb-7">{title}</h2>

			<ul className="space-y-2">{children}</ul>
		</div>
	);
};

const FooterLinkItem = ({
	label,
	link,
	locale,
}: {
	label: string;
	link: string;
	locale?: string;
}) => {
	return (
		<li className="">
			<Link locale={locale} href={link}>
				{label}
			</Link>
		</li>
	);
};
