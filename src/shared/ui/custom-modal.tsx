import type { FC, ReactNode } from "react";
import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"


interface ICustomModal {
	title: string;
	onConfirm: () => void;
	toggleButtonText: string;
	confirmButtonText: string;
	children: ReactNode;
	description?: string;
}

export const CustomModal: FC<ICustomModal> = ({
	title, onConfirm, description, toggleButtonText, confirmButtonText, children
}) => {
  return (
		<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{toggleButtonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
					{children}
        <DialogFooter>
          <Button type="submit" onClick={onConfirm}>{confirmButtonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
	)
}