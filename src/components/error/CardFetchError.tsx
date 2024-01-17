import Image from "next/image";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { useTranslations } from "next-intl";

export const CardFetchError = ({ error }: { error?: string }) => {
	const _ = useTranslations("error");

	return (
		<Card>
			<CardHeader>
				<CardTitle>{error ? error : _("error")}</CardTitle>
				<CardDescription>{_("error_des")}</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col items-center justify-center">
				<Image
					src={"/no_conexion.png"}
					width={150}
					height={150}
					alt="No conexion image"
				/>
			</CardContent>
		</Card>
	);
};
