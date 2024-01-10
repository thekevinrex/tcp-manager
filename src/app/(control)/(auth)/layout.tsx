export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="grid place-content-center w-full h-full min-h-screen">
			{children}
		</div>
	);
}
