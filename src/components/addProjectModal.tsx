import { useAddJiraProject } from "@/api/jira/hooks/use-projects";
import { CustomModal } from "@/shared/ui/custom-modal";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { Interceptor } from "./interceptor";
import { useJiraUsers } from "@/api/jira/hooks/use-users";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { toast } from "react-toastify";

export const AddProjectModal = () => {
	const [formState, setFormState] = useState({ name: "", key: "" });
	const [isError, setError] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string>();

	const { data, error, status } = useJiraUsers();
	const { mutateAsync: addProject } = useAddJiraProject();

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
				if (!formState.key || !formState.name || !selectedUserId) {
					return setError(true);
				}
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
			toggleButtonText="Создать проект"
		>
			<div className="grid gap-4 py-4">
				<Input
					id="name"
					className="col-span-4"
					placeholder="Название проекта"
					value={formState.name}
					onChange={(e) => {
						if (isError) {
							setError(false);
						}
						setFormState({ ...formState, name: e.target.value });
					}}
				/>
				<Input
					id="key"
					className="col-span-4"
					value={formState.key}
					placeholder="KEY"
					onChange={(e) => {
						if (isError) {
							setError(false);
						}
						setFormState({ ...formState, key: e.target.value });
					}}
				/>
				<Interceptor status={status} errorMessage={error?.message}>
					<div className="col-span-4">
						<Select
							onValueChange={(value) => {
								if (isError) {
									setError(false);
								}
								setSelectedUserId(value);
							}}
							value={
								data?.some((user) => String(user.accountId) === selectedUserId)
									? selectedUserId
									: undefined
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Выберете руководителя проекта" />
							</SelectTrigger>
							<SelectContent>{userSelectOptions}</SelectContent>
						</Select>
					</div>
				</Interceptor>
				{isError && (
					<p className="text-red-400 text-xs">Заполнены не все поля</p>
				)}
			</div>
		</CustomModal>
	);
};
