import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function POST(req: Request) {
	// You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error(
			"Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
		);
	}

	// Get the headers
	const headerPayload = headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occured -- no svix headers", {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		return new Response("Error occured veri", {
			status: 400,
		});
	}

	// Get the ID and type
	const { id } = evt.data;
	const eventType = evt.type;

	const transactions = [];

	if (eventType === "organization.created") {
		transactions.push(
			db.organization.create({
				data: {
					org: evt.data.id,
					name: evt.data.name,
					image: evt.data.image_url,
					slug: evt.data.slug === null ? evt.data.id : evt.data.slug,
				},
			})
		);
	} else if (eventType === "organization.updated") {
		try {
			const org = await db.organization.findUnique({
				where: {
					org: evt.data.id,
				},
			});

			transactions.push(
				org !== null
					? db.organization.update({
							where: {
								org: evt.data.id,
							},
							data: {
								name: evt.data.name,
								image: evt.data.image_url,
								slug: evt.data.slug === null ? evt.data.id : evt.data.slug,
							},
					  })
					: db.organization.create({
							data: {
								org: evt.data.id,
								name: evt.data.name,
								image: evt.data.image_url,
								slug: evt.data.slug === null ? evt.data.id : evt.data.slug,
							},
					  })
			);
		} catch (err: any) {
			return new Response(err.message, {
				status: 400,
			});
		}
	} else if (eventType === "organization.deleted" && evt.data.deleted) {
		transactions.push(
			db.organization.delete({
				where: {
					org: evt.data.id,
				},
			})
		);
	}

	console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
	console.log("Webhook body:", body);

	await db.$transaction(transactions);

	return new Response("", { status: 200 });
}
