import { Step } from "@/shared/ui/step";
import { useAppStore } from "@/store/app-store";
import { Interceptor } from "../interceptor";
import { PriorityMappingTable } from "../tables/priority-mapping-table";
import { useTaskPriority } from "@/api/jira/hooks/use-tasks";

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

	return (
		<Step
			title="Шаг 10. Сопоставление приоритетов Weeek и Jira"
			content={
				<Interceptor
					status={jiraPriorityStatus}
					errorMessage={jiraPriorityError?.message}
				>
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
				</Interceptor>
			}
			isActive={!!statusesMap}
		/>
	);
};
