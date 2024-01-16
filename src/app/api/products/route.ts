import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";

type SearchProduct = {
	q?: string;
	filters?: string;
	lastId?: number;
};

export async function GET(req: Request) {
	// Get the body
	const { searchParams } = new URL(req.url);

	const shema = z.object({
		lastId: z.number(),
		max: z.number(),
		q: z.string().nullable(),
		orgId: z.string().nullable(),
	});

	const result = shema.safeParse({
		lastId: Number(searchParams.get("lastId")),
		max: Number(searchParams.get("max")),
		q: searchParams.get("q"),
		orgId: searchParams.get("org"),
	});

	if (!result.success) {
		return new Response("Invalid data", { status: 400 });
	}

	const { lastId, max, orgId, q } = result.data;

	const where: Prisma.ProductWhereInput = {
		status: {
			not: "hidden",
		},
		organization: {
			visible: true,
		},
		id: {
			gt: lastId ? lastId : 0,
		},
	};

	if (q) {
		where.name = {
			contains: q,
			mode: "insensitive",
		};
	}

	if (orgId && orgId !== "") {
		where.org = orgId;
	}

	try {
		const products = await db.product.findMany({
			where,
			take: max ? max : 10,
			orderBy: {
				id: "asc",
			},
		});

		return Response.json({ products }, { status: 200 });
	} catch {
		return new Response("An error ocurred", { status: 400 });
	}
}
