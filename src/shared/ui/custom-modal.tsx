import { useState, type FC, type ReactNode } from "react";
import { Button } from "./button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./dialog";

interface ICustomModal {
	title: string;
	onConfirm: () => Promise<void>;
	toggleButtonText: string;
	confirmButtonText: string;
	children: ReactNode;
	description?: string;
}

export const CustomModal: FC<ICustomModal> = ({
	title,
	onConfirm,
	description,
	toggleButtonText,
	confirmButtonText,
	children,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen}>
			<Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
				{toggleButtonText}
			</Button>
			<DialogContent
				className="sm:max-w-[425px]"
				onClose={() => setIsOpen(false)}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				{children}
				<DialogFooter>
					<Button
						type="submit"
						onClick={async () => {
							await onConfirm();
							setIsOpen(false);
						}}
					>
						{confirmButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
