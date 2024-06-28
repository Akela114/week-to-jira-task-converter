import { cn } from "@/lib/utils/cn";
import type { FC, ReactNode } from "react";

type StepProps = {
	title: string;
	content: ReactNode;
	isActive?: boolean;
};

export const Step: FC<StepProps> = ({ title, content, isActive }) => {
	return (
		<div className={cn("space-y-[5px] last:border-b-0 border-b-2 p-[20px]")}>
			<div
				className={cn("font-medium", {
					"text-muted": !isActive,
				})}
			>
				{title}
			</div>
			{isActive && content}
		</div>
	);
};
