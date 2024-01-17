import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { Input } from "./ui/input";
import { Modal } from "./modal";
import { DialogTrigger } from "./ui/dialog";
import { useTranslations } from "next-intl";
import { CalculatorIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function Calculator() {
	const _ = useTranslations("alert");

	return (
		<Modal
			title={_("calc")}
			description={_("calc_des")}
			trigger={
				<DialogTrigger asChild>
					<Button type="button">
						<CalculatorIcon />
					</Button>
				</DialogTrigger>
			}
			dialogClass="sm:max-w-[550px]"
		>
			<CalculatorBody />
		</Modal>
	);
}

export const CalculatorBody = () => {
	const _ = useTranslations("alert");
	const DENOMINACIONES = [5, 10, 20, 50, 100, 200, 500, 1000];

	const [money, setMoney] = useState<{ value: number; denominacion: number }[]>(
		[]
	);

	const [total, setTotal] = useState("0");

	const handleValueChange = (value: number, denominacion: number) => {
		const alreadyMoney = money.find((n) => n.denominacion === denominacion);
		if (alreadyMoney) {
			alreadyMoney.value = value;

			setMoney([...money]);
		} else {
			setMoney([
				...money,
				{
					value: value,
					denominacion: denominacion,
				},
			]);
		}
	};

	useEffect(() => {
		let newTotal = 0;

		for (const { value, denominacion } of money) {
			newTotal += value * denominacion;
		}

		setTotal(formatCurrency(newTotal));
	}, [money]);

	return (
		<>
			<div className="sticky -top-6 flex flex-row justify-between items-center py-2 border-b bg-background">
				<div className="text-3xl text-green-600 font-bold mt-5 flex items-center">
					{total}
				</div>
				<div>
					<Button onClick={() => setMoney([])} variant={"ghost"}>
						{_("reset")}
					</Button>
				</div>
			</div>
			<div className="flex flex-col space-y-3">
				{DENOMINACIONES.map((denominacion) => {
					return (
						<label key={denominacion} className="text-sm font-semibold">
							{_("calc_deno", { denominacion })}
							<Input
								name={`d${denominacion}`}
								type="number"
								onChange={(e) =>
									handleValueChange(Number(e.target.value) || 0, denominacion)
								}
								value={
									money.find((n) => n.denominacion === denominacion)?.value || 0
								}
								placeholder={_("cant_deno", { denominacion })}
							/>
						</label>
					);
				})}
			</div>
		</>
	);
};
