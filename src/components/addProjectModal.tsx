import { CustomModal } from "@/shared/ui/custom-modal";
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import type { FC } from "react";


interface IModalProps {
	title: string;
	onConfirm: () => void;
	description?: string;
}

export const AddProjectModal: FC<IModalProps> = () => {
  return (
			<CustomModal 
				confirmButtonText="Создать"
				title="Создать проект"
				onConfirm={() => console.log("submit")}
				toggleButtonText="Создайте проект"
			>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Название
            </Label>
            <Input
              id="name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="key" className="text-right">
              KEY
            </Label>
            <Input
              id="key"
              className="col-span-3"
            />
          </div>
					<div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Руководитель
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
			</CustomModal>
  )
}
