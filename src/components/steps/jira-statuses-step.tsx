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
import { useMemo } from "react";

const FIELDS_TO_CHECK = [
	{ id: "priority", name: "приоритет" },
	{ id: "reporter", name: "автор" },
	{ id: "assignee", name: "исполнитель" },
];

export const JiraStatusesStep = () => {
	const jiraProject = useAppStore((state) => state.jiraProjectId);
	const jiraProjectId = useAppStore((state) => state.jiraProjectId);
	const jiraTasksTypeId = useAppStore((state) => state.jiraTasksTypeId);
	const setJiraTasksTypeId = useAppStore((state) => state.setJiraTasksTypeId);
	const resetJiraTasksTypeId = useAppStore(
		(state) => state.resetJiraTasksTypeId,
	);

	const { data: projectMetaData } = useJiraProjectMeta(
		jiraTasksTypeId,
		jiraProject,
	);

	const targetFieldsIds = projectMetaData?.fields
		? FIELDS_TO_CHECK.filter(
				(field) =>
					!projectMetaData?.fields.some(({ fieldId }) => fieldId === field.id),
			)
		: [];

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
					{targetFieldsIds?.length > 0 && (
						<div className="text-red-700 opacity-50">
							Для данного проекта и типа задач не будут установлены такие поля
							как{" "}
							{targetFieldsIds
								.map(({ name }) => `"${name}"`)
								.join(targetFieldsIds.length > 1 ? ", " : "")}
						</div>
					)}
				</Interceptor>
			}
			title="Шаг 5. Выбор типа задач, который будет использован при создании задач в Jira"
			isActive={!!jiraProjectId}
		/>
	);
};
