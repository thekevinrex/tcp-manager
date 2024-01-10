import { FormErrors } from "@/components/error/FormErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Organization } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function OrganizationBody({
	errors,
	visible,
	handleVisible,
	domicilio,
	org,
	handleDomicilio,
}: {
	errors: any;
	org: Organization;
	visible: boolean;
	handleVisible: (value: boolean) => void;
	domicilio: boolean;
	handleDomicilio: (value: boolean) => void;
}) {
	const { pending } = useFormStatus();

	return (
		<>
			<ClerkFormRow id="org-des" label="Organization description">
				<Textarea
					placeholder="Organization description"
					name="description"
					id="org-des"
					disabled={pending}
					defaultValue={org?.description || ""}
				/>
				<FormErrors errors={errors} id="description" />
			</ClerkFormRow>

			<ClerkFormRow id="org-location" label="Organization Location">
				<Input
					placeholder="Organization location"
					name="location"
					id="org-location"
					required
					disabled={pending}
					defaultValue={org?.location || ""}
				/>
				<FormErrors errors={errors} id="location" />
			</ClerkFormRow>

			<ClerkFormRow id="org-phone" label="Organization Phone number">
				<Input
					placeholder="Organization phone number"
					name="phone"
					id="org-phone"
					required
					defaultValue={org?.phone || ""}
					disabled={pending}
				/>
				<FormErrors errors={errors} id="phone" />
			</ClerkFormRow>

			<div className="flex flex-row items-center justify-between rounded-lg border p-4 my-5">
				<div className="space-y-0.5">
					<Label className="text-base" htmlFor="org-domicilio">
						Domicilio
					</Label>
					<p className="text-xs text-muted-foreground">
						Check if you are going to do home deliver. <br /> if you check this
						option the customers can send you request for home deliver of your
						products
					</p>

					<FormErrors errors={errors} id="domicilio" />
				</div>
				<div>
					<Switch
						id="org-domicilio"
						checked={domicilio}
						disabled={pending}
						onCheckedChange={(checked) => handleDomicilio(checked)}
					/>
				</div>
			</div>

			{domicilio && (
				<ClerkFormRow id="org-domicilio-details" label="Domicilio details">
					<Input
						placeholder="Domicilio details"
						name="domicilio_details"
						id="org-domicilio-details"
						disabled={pending}
						defaultValue={org?.domicilio_details || ""}
					/>
					<FormErrors errors={errors} id="domicilio_details" />
				</ClerkFormRow>
			)}

			<div className="flex flex-row items-center justify-between rounded-lg border p-4 my-5">
				<div className="space-y-0.5">
					<Label className="text-base" htmlFor="org-visible">
						Visibility
					</Label>
					<p className="text-xs text-muted-foreground">
						Check if you organization is going to be visible in the shop page
					</p>

					<FormErrors errors={errors} id="visible" />
				</div>
				<div>
					<Switch
						id="org-visible"
						checked={visible}
						disabled={pending}
						onCheckedChange={(checked) => handleVisible(checked)}
					/>
				</div>
			</div>

			<div className="mt-5 flex justify-end">
				<Button disabled={pending}>
					{pending ? <Loader2 className="animate-spin" /> : "Continue"}
				</Button>
			</div>
		</>
	);
}

const ClerkFormRow = ({
	label,
	id,
	children,
}: {
	label: string;
	id: string;
	children: React.ReactNode;
}) => {
	return (
		<div className="flex-col flex my-5">
			<Label htmlFor={id}>{label}</Label>
			{children}
		</div>
	);
};
