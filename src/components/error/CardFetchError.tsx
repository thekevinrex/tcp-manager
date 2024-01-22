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
					src={"/no_conexion.svg"}
					width={150}
					height={150}
					alt="No conexion image"
				/>
				<div className="text-xs text-center my-3 text-muted-foreground">
					<a href="https://www.freepik.com/free-vector/offline-concept-illustration_18352146.htm">
						Image by storyset
					</a>{" "}
					on Freepik
				</div>
			</CardContent>
		</Card>
	);
};
