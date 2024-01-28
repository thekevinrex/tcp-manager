import db from "@/lib/db";

export const dynamic = "force-dynamic";
export async function POST(req: Request) {
	// Get the body
	const { searchParams } = new URL(req.url);

	const page = Number(searchParams.get("page")) || 1;
	const max = Number(searchParams.get("max")) || 10;
	const q = String(searchParams.get("q"));

	try {
		const organizations = await db.organization.findMany({
			where: {
				visible: true,
				name: {
					contains: q ? q : "",
					mode: "insensitive",
				},
			},
			skip: (page - 1) * max,
			take: max,
		});

		return Response.json({ organizations }, { status: 200 });
	} catch {
		return new Response("An error ocurred", { status: 400 });
	}
}
