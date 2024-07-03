import { Step } from "@/shared/ui/step";
import { Interceptor } from "../interceptor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { useAppStore } from "@/store/app-store";
import { useProjectRoles } from "@/api/jira/hooks/use-project-roles";

export const JiraProjectMemberRoleSelectionStep = () => {
	const jiraProjectId = useAppStore((state) => state.jiraProjectId);
	const jiraTaskTypeId = useAppStore((state) => state.jiraTasksTypeId);
	const jiraSubtasksTypeId = useAppStore((state) => state.jiraSubtasksTypeId);

	const { data, status, error } = useProjectRoles({ projectId: jiraProjectId });

	const roleId = useAppStore((state) => state.jiraRoleId);
	const setRoleId = useAppStore((state) => state.setJiraRoleId);
	const resetRoleId = useAppStore((state) => state.resetJiraRoleId);

	const projectMemberRoleSelectOptions =
		data &&
		Object.entries(data).map(([key, value]) => (
			<SelectItem value={value} key={value}>
				{key}
			</SelectItem>
		));

	if (
		status === "success" &&
		data &&
		roleId &&
		!Object.values(data).some((value) => value === roleId)
	) {
		resetRoleId();
	}

	return (
		<Step
			title="Шаг 7. Выбор роли, пользователи которой могут создавать и выполнять задачи"
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<div className="flex gap-4 items-center">
						<Select
							onValueChange={setRoleId}
							value={
								data &&
								roleId &&
								Object.values(data).some((value) => value === roleId)
									? roleId
									: undefined
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Выберите роль" />
							</SelectTrigger>
							<SelectContent>{projectMemberRoleSelectOptions}</SelectContent>
						</Select>
					</div>
				</Interceptor>
			}
			isActive={Boolean(jiraTaskTypeId && jiraSubtasksTypeId)}
		/>
	);
};
