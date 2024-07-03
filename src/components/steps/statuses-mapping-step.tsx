import { Step } from "@/shared/ui/step";
import { useAppStore } from "@/store/app-store";
import { useStatuses } from "@/api/jira/hooks/use-projects";
import { Interceptor } from "../interceptor";
import { StatusesMappingTable } from "../tables/statuses-mapping-table";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { useMemo, type ComponentProps } from "react";

export const StatusesMappingStep = () => {
	const jiraProjectId = useAppStore((state) => state.jiraProjectId);
	const jiraTaskTypeID = useAppStore((state) => state.jiraTasksTypeId);
	const usersMap = useAppStore((state) => state.usersMap);
	const jiraSubtasksTypeId = useAppStore((state) => state.jiraSubtasksTypeId);
	const projectId = useAppStore((state) => state.projectId);
	const boardId = useAppStore((state) => state.boardId);
	const {
		data: tasksData,
		status: tasksStatus,
		error: tasksError,
	} = useTasksList({ projectId, boardId });
	const {
		data: statusesData,
		status: statusesStatus,
		error: statusesError,
	} = useStatuses(jiraProjectId);

	const filteredStatuses = statusesData?.find(
		(status) => status.id === jiraTaskTypeID || jiraSubtasksTypeId,
	)?.statuses;

	let globalStatus: ComponentProps<typeof Interceptor>["status"];
	if (tasksStatus === "error" || statusesStatus === "error") {
		globalStatus = "error";
	} else if (tasksStatus === "pending" || statusesStatus === "pending") {
		globalStatus = "pending";
	} else {
		globalStatus = "success";
	}

	const weeekStatuses = useMemo(
		() =>
			tasksData?.boardColumns.map((column) => ({
				id: String(column.id),
				name: column.name,
			})) ?? [],
		[tasksData],
	);

	return (
		<Step
			title="Шаг 9. Сопоставление колонок из Weeek статусам в Jira"
			content={
				<Interceptor
					status={globalStatus}
					errorMessage={tasksError?.message ?? statusesError?.message}
				>
					<StatusesMappingTable
						weekStatuses={weeekStatuses}
						jiraStatuses={
							filteredStatuses?.map((status) => ({
								id: status.id,
								name: status.name,
							})) ?? []
						}
					/>
				</Interceptor>
			}
			isActive={Boolean(usersMap)}
		/>
	);
};
