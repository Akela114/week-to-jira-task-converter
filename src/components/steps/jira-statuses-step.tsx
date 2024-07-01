import { useStatuses } from "@/api/jira/hooks/use-projects";
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

export const JiraStatusesStep = () => {
	const jiraProject = useAppStore((state) => state.jiraProjectId);
	const usersMap = useAppStore((state) => state.usersMap);
	const jiraTasksTypeId = useAppStore((state) => state.jiraTasksTypeId);
	const setJiraTasksTypeId = useAppStore((state) => state.setJiraTasksTypeId);
	const resetJiraTasksTypeId = useAppStore(
		(state) => state.resetJiraTasksTypeId,
	);

	const { data, error, status } = useStatuses(jiraProject);

	const TypeSelectOptions = data?.map((type) => (
		<SelectItem value={String(type.id)} key={type.id}>
			{type.name}
		</SelectItem>
	));

	if (
		status === "success" &&
		!data.some((type) => type.id === jiraTasksTypeId)
	) {
		resetJiraTasksTypeId();
	}

	return (
		<Step
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<Select
						onValueChange={setJiraTasksTypeId}
						value={
							data?.some((type) => type.id === jiraTasksTypeId)
								? jiraTasksTypeId
								: undefined
						}
					>
						<SelectTrigger className="w-[300px]">
							<SelectValue placeholder="Выберите тип задач" />
						</SelectTrigger>
						<SelectContent>{TypeSelectOptions}</SelectContent>
					</Select>
				</Interceptor>
			}
			title="Шаг 7. Выбор типа задач, который будет использован при создании задач в Jira"
			isActive={!!usersMap}
		/>
	);
};
