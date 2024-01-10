"use server";

import { auth } from "@clerk/nextjs";

import { createSafeAction } from "@/lib/create-safe-action";
import db from "@/lib/db";

import { Organization, InputType, ReturnType } from "./shema";
import { Prisma } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return { error: "User not authenticated or not in a organization" };
	}

	const {
		description,
		domicilio,
		domicilio_details,
		location,
		phone,
		visible,
	} = data;

	const UpdateData: Prisma.OrganizationUpdateInput = {
		description,
		phone,
		location,
		domicilio: domicilio,
		domicilio_details,
		visible,
	};

	try {
		const org = await db.organization.findUnique({
			where: {
				org: orgId,
			},
		});

		if (!org) {
			return { error: "No organization found" };
		}

		const Organization = await db.organization.update({
			where: {
				org: orgId,
			},
			data: UpdateData,
		});

		return { data: Organization };
	} catch (error: any) {
		return { error: error.message };
	}
};

export const organization = createSafeAction(Organization, handler);
