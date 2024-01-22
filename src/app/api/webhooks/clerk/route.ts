import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { clerkClient } from "@clerk/nextjs";
import { PLANS_USERS } from "@/config/site";

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

	if (eventType === "user.created") {
		const user = evt.data;
		const solicitudId = user.public_metadata.solicitud as number;

		if (solicitudId) {
			try {
				const solicitud = await db.solicitudes.findUnique({
					where: {
						id: solicitudId,
						user: null,
					},
				});

				if (solicitud) {
					const updated = await db.solicitudes.update({
						where: {
							id: solicitudId,
						},
						data: {
							user: user.id,
						},
					});

					const updatedUser = await clerkClient.users.updateUser(user.id, {
						createOrganizationEnabled: true,
						publicMetadata: {},
					});
				}
			} catch (err: any) {
				return new Response(err.message, {
					status: 400,
				});
			}
		}
	}

	if (eventType === "organization.created") {
		try {
			const solicitud = await db.solicitudes.findFirst({
				where: {
					user: evt.data.created_by,
				},
			});

			const org = await db.organization.create({
				data: {
					org: evt.data.id,
					name: evt.data.name,
					image: evt.data.image_url,
					slug: evt.data.slug === null ? evt.data.id : evt.data.slug,
					plan:
						solicitud &&
						["mypime", "tcp"].includes(solicitud.org_type) &&
						solicitud.aviable > 0
							? "pro"
							: "free",
					phone: solicitud ? solicitud.phone : "",
					email: solicitud ? solicitud.email : "",
				},
			});

			if (solicitud) {
				const newSolicitud = await db.solicitudes.update({
					where: {
						id: solicitud.id,
					},
					data: {
						aviable: {
							decrement: 1,
						},
					},
				});

				const totalOrg = await db.organization.count({
					where: {
						by_user: evt.data.created_by,
					},
				});

				if (totalOrg >= PLANS_USERS[solicitud.org_type].max_org) {
					const updatedUser = await clerkClient.users.updateUser(
						evt.data.created_by,
						{ createOrganizationEnabled: false }
					);
				}
			}
		} catch (err: any) {
			return new Response(err.message, {
				status: 400,
			});
		}
	}

	if (eventType === "organization.updated") {
		try {
			const updatedOrg = await db.organization.update({
				where: {
					org: evt.data.id,
				},
				data: {
					name: evt.data.name,
					image: evt.data.image_url,
					slug: evt.data.slug === null ? evt.data.id : evt.data.slug,
				},
			});
		} catch (err: any) {
			return new Response(err.message, {
				status: 400,
			});
		}
	}

	if (eventType === "organization.deleted") {
		try {
			const deleted = await db.organization.delete({
				where: {
					org: evt.data.id,
				},
			});
		} catch (err: any) {
			return new Response(err.message, {
				status: 400,
			});
		}
	}

	console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
	console.log("Webhook body:", body);

	return new Response("", { status: 200 });
}
