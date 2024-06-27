import { useAddJiraProject } from "@/api/jira/hooks/use-projects";
import { CustomModal } from "@/shared/ui/custom-modal";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useState, type FC } from "react";
import { Interceptor } from "./interceptor";
import { useJiraUsers } from "@/api/jira/hooks/use-users";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { useJiraStore } from "@/store/jira-store";
import { toast } from "react-toastify";

interface IModalProps {
	title: string;
	onConfirm: () => void;
	description?: string;
}

export const AddProjectModal: FC<IModalProps> = () => {
	const [formState, setFormState] = useState({ name: "", key: "" });

	const { data, error, status } = useJiraUsers();
	const { mutateAsync: addProject } = useAddJiraProject();

	const selectedUserId = useJiraStore((store) => store.selectedJiraUser);
	const setSelectedUser = useJiraStore((state) => state.setSelectedJiraUser);

	const userSelectOptions = data
		?.filter(({ accountType }) => accountType !== "app")
		.map((user) => (
			<SelectItem value={String(user?.accountId)} key={user?.accountId}>
				{user?.displayName}
			</SelectItem>
		));

	return (
		<CustomModal
			confirmButtonText="Создать"
			title="Создать проект"
			onConfirm={async () => {
				if (selectedUserId) {
					return await addProject({
						key: formState.key,
						leadAccountId: selectedUserId,
						name: formState.name,
						projectTypeKey: "software",
					});
				}
				toast("Не выбран руководитель проекта");
			}}
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
						value={formState.name}
						onChange={(e) =>
							setFormState({ ...formState, name: e.target.value })
						}
					/>
				</div>
				<div className="grid grid-cols-4 items-center gap-4">
					<Label htmlFor="key" className="text-right">
						KEY
					</Label>
					<Input
						id="key"
						className="col-span-3"
						value={formState.key}
						onChange={(e) =>
							setFormState({ ...formState, key: e.target.value })
						}
					/>
				</div>
				<Interceptor status={status} errorMessage={error?.message}>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" className="text-right">
							Руководитель
						</Label>
						<Select
							onValueChange={setSelectedUser}
							value={
								data?.some((user) => String(user.accountId) === selectedUserId)
									? selectedUserId
									: undefined
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Выберите проект" />
							</SelectTrigger>
							<SelectContent>{userSelectOptions}</SelectContent>
						</Select>
					</div>
				</Interceptor>
			</div>
		</CustomModal>
	);
};
