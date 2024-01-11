import { Header } from "../_components/header";

export default function ProductLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<header className="w-full flex flex-row justify-center fixed top-0 left-0 bg-background">
				<Header />
			</header>

			<main className="flex flex-col w-full">{children}</main>
		</>
	);
}
