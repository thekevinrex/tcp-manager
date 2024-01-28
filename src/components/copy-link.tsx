"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

export function CopyLink({ link }: { link: string }) {
	const [copied, setCopied] = useState(false);

	const copy = () => {
		navigator.clipboard.writeText(link);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<div className="flex items-center justify-center relative">
			<Button onClick={copy} variant={"outline"}>
				<Copy className="w-6 h-6 text-gray-500" />
				<span className="ml-2 text-sm text-gray-500">
					{copied ? "Copied" : "Copy"}
				</span>
			</Button>
		</div>
	);
}
