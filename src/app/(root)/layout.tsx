import { Header } from "./_components/header";

export default function ProductLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col w-full items-center min-h-screen">
			<header className="w-full flex flex-row justify-center sticky top-0">
				<Header />
			</header>

			<main className="flex flex-col w-full max-w-screen-xl">{children}</main>
		</div>
	);
}
