import { Step } from "@/shared/ui/step";
import { Interceptor } from "../interceptor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { useJiraProjectsList } from "@/api/jira/hooks/use-projects";
import { useAppStore } from "@/store/app-store";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";

export const JiraProjectSelectionStep = () => {
	const { data, status, error } = useJiraProjectsList();

	const projectId = useAppStore((state) => state.projectId);
	const boardId = useAppStore((state) => state.boardId);
	const { status: weekTasksStatus } = useTasksList({ projectId, boardId });

	const jiraProjectId = useAppStore((state) => state.jiraProjectId);
	const setJiraProjectId = useAppStore((state) => state.setJiraProjectId);
	const resetJiraProjectId = useAppStore((state) => state.resetJiraProjectId);

	const projectSelectOptions = data?.map((project) => (
		<SelectItem value={String(project.id)} key={project.id}>
			{project.name}
		</SelectItem>
	));

	if (
		status === "success" &&
		!data.some((project) => project.id === jiraProjectId)
	) {
		resetJiraProjectId();
	}

	return (
		<Step
			title="Шаг 4. Выбор проекта в JIRA"
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<div className="flex gap-4 items-center">
						<Select
							onValueChange={setJiraProjectId}
							value={
								data?.some((project) => project.id === jiraProjectId)
									? jiraProjectId
									: undefined
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Выберите проект" />
							</SelectTrigger>
							<SelectContent>{projectSelectOptions}</SelectContent>
						</Select>
					</div>
				</Interceptor>
			}
			isActive={weekTasksStatus === "success"}
		/>
	);
};
