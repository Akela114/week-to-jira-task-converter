import { Step } from "@/shared/ui/step";
import { useAppStore } from "@/store/app-store";
import { Interceptor } from "../interceptor";
import { PriorityMappingTable } from "../tables/priority-mapping-table";
import { useTaskPriority } from "@/api/jira/hooks/use-tasks";
import { useEffect } from "react";

type Priority = "0" | "1" | "2" | "3";
type PriorityName = "Low" | "Medium" | "High" | "Hold";
const TaskPriorityMapping: Record<Priority, PriorityName> = {
	"0": "Low",
	"1": "Medium",
	"2": "High",
	"3": "Hold",
};

export const PriorityMappingStep = () => {
	const statusesMap = useAppStore((state) => state.statusesMap);

	const {
		data: jiraAllPriorities,
		status: jiraPriorityStatus,
		error: jiraPriorityError,
	} = useTaskPriority();

	const disabledTasksFields = useAppStore((state) => state.disabledTaskFields);
	const disabledSubtasksFields = useAppStore(
		(state) => state.disabledSubTaskFields,
	);
	const setPriorityMap = useAppStore((state) => state.setPriorityMap);
	const isMappingNeeded = [
		...(disabledSubtasksFields ?? []),
		...(disabledTasksFields ?? []),
	]?.some((field) => !["priority"].includes(field.id));

	useEffect(() => {
		if (
			!isMappingNeeded &&
			disabledSubtasksFields &&
			disabledTasksFields &&
			statusesMap
		) {
			setPriorityMap({});
		}
	}, [
		isMappingNeeded,
		disabledSubtasksFields,
		disabledTasksFields,
		setPriorityMap,
		statusesMap,
	]);

	return (
		<Step
			title="Шаг 10. Сопоставление приоритетов Weeek и Jira"
			content={
				<Interceptor
					status={jiraPriorityStatus}
					errorMessage={jiraPriorityError?.message}
				>
					{isMappingNeeded ? (
						<PriorityMappingTable
							weekPriority={Object.entries(TaskPriorityMapping).map(
								([id, name]) => ({
									id: String(id),
									name,
								}),
							)}
							jiraPriority={
								jiraAllPriorities?.map((priority) => ({
									id: priority.id,
									name: priority.name,
								})) ?? []
							}
						/>
					) : (
						<div>Сопоставление не требуется 😊</div>
					)}
				</Interceptor>
			}
			isActive={!!statusesMap}
		/>
	);
};
