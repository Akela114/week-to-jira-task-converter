import { useJiraProjectMeta, useStatuses } from "@/api/jira/hooks/use-projects";
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
import { useEffect, useMemo } from "react";

const FIELDS_TO_CHECK = [
	{ id: "priority", name: "приоритет" },
	{ id: "reporter", name: "автор" },
	{ id: "assignee", name: "исполнитель" },
];

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

	const { data: projectMetaData } = useJiraProjectMeta(
		jiraSubtasksTypeId,
		jiraProject,
	);

	const disabledFields = useAppStore((state) => state.disabledSubTaskFields);
	const setSubtasksDisabledFields = useAppStore(
		(state) => state.setSubtasksDisabledFields,
	);

	useEffect(() => {
		if (projectMetaData?.fields) {
			setSubtasksDisabledFields(
				FIELDS_TO_CHECK.filter(
					(field) =>
						!projectMetaData?.fields.some(
							({ fieldId }) => fieldId === field.id,
						),
				),
			);
		}
	}, [projectMetaData, setSubtasksDisabledFields]);

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
								: ""
						}
					>
						<SelectTrigger className="w-[300px]">
							<SelectValue placeholder="Выберите тип задач" />
						</SelectTrigger>
						<SelectContent>{TypeSelectOptions}</SelectContent>
					</Select>
					{disabledFields?.length ? (
						<div className="text-red-700 opacity-50">
							Для данного проекта и типа задач не будут установлены такие поля
							как {disabledFields.map(({ name }) => `"${name}"`).join(", ")}
						</div>
					) : null}
				</Interceptor>
			}
			title="Шаг 6. Выбор типа задач, который будет использован при создании подзадач в Jira"
			isActive={Boolean(jiraTasksTypeId)}
		/>
	);
};
