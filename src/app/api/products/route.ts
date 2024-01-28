import db from "@/lib/db";
import { Prisma } from "@prisma/client";

type SearchProduct = {
	org: string;
	min?: string;
	max?: string;
	order?: string;
};

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
	// Get the body
	const { searchParams } = new URL(req.url);

	const page = Number(searchParams.get("page")) || 1;
	const pageSize = Number(searchParams.get("max")) || 10;
	const q = String(searchParams.get("q"));

	const body: SearchProduct = await req.json();

	const { org, max, min, order } = body;

	const where: Prisma.ProductWhereInput = {
		status: {
			not: "hidden",
		},
		organization: {
			visible: true,
		},
		org: org ? org : undefined,
		price: {
			gte: min ? parseInt(min) : undefined,
			lte: max ? parseInt(max) : undefined,
		},
	};

	if (q) {
		where.name = {
			contains: q,
			mode: "insensitive",
		};
	}

	try {
		const products = await db.product.findMany({
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
			orderBy: {
				price: order ? (order === "price_asc" ? "asc" : "desc") : undefined,
			},
		});

		products.forEach((product) => {
			product.aviable = product.aviable > 0 ? 1 : 0;
		});

		return Response.json({ products }, { status: 200 });
	} catch (err: any) {
		return new Response("An error ocurred", { status: 400 });
	}
}
