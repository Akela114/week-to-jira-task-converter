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

export const JiraSubtasksStatusesStep = () => {
	const jiraProject = useAppStore((state) => state.jiraProjectId);
	const jiraTasksTypeId = useAppStore((state) => state.jiraTasksTypeId);
	const jiraSubtasksTypeId = useAppStore((state) => state.jiraSubtasksTypeId);
	const setJiraSubtasksTypeId = useAppStore(
		(state) => state.setJiraSubtasksTypeId,
	);
	const resetJiraSubtasksTypeId = useAppStore(
		(state) => state.resetJiraSubtasksTypeId,
	);

	const { data, error, status } = useStatuses(jiraProject);

	const TypeSelectOptions = data?.map((type) => (
		<SelectItem value={String(type.id)} key={type.id}>
			{type.name}
		</SelectItem>
	));

	if (
		status === "success" &&
		!data.some((type) => type.id === jiraSubtasksTypeId)
	) {
		resetJiraSubtasksTypeId();
	}

	return (
		<Step
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<Select
						onValueChange={setJiraSubtasksTypeId}
						value={
							data?.some((type) => type.id === jiraSubtasksTypeId)
								? jiraSubtasksTypeId
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
			title="Шаг 8. Выбор типа задач, который будет использован при создании подзадач в Jira"
			isActive={Boolean(jiraTasksTypeId)}
		/>
	);
};
