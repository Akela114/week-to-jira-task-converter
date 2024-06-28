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
import { useJiraStore } from "@/store/jira-store";
import { AddProjectModal } from "../addProjectModal";
import { useWeeekStore } from "@/store/weeek-store";

export const JiraProjectSelectionStep = () => {
	const { data, status, error } = useJiraProjectsList();

	const selectedProjectId = useJiraStore((store) => store.selectedProjectId);
	const setSelectedProjectId = useJiraStore(
		(state) => state.setSelectedProjectId,
	);

	const selectedJiraUserId = useJiraStore((store) => store.selectedJiraUser);
	const selectedWeeekUserId = useWeeekStore((store) => store.userId);

	const projectSelectOptions = data?.map((project) => (
		<SelectItem value={String(project.id)} key={project.id}>
			{project.name}
		</SelectItem>
	));

	return (
		<Step
			title="Шаг 5. Выберите проект в JIRA"
			content={
				<div className="flex gap-4 items-center">
					<Interceptor status={status} errorMessage={error?.message}>
						<Select
							onValueChange={setSelectedProjectId}
							value={
								data?.some(
									(project) => String(project.id) === selectedProjectId,
								)
									? selectedProjectId
									: undefined
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Выберите проект" />
							</SelectTrigger>
							<SelectContent>{projectSelectOptions}</SelectContent>
						</Select>
					</Interceptor>
					<p>ИЛИ</p>
					<AddProjectModal
						title="Создать новый проект в JIRA"
						onConfirm={() => console.log("sadsad")}
					/>
				</div>
			}
			isActive={!!selectedJiraUserId && !!selectedWeeekUserId}
		/>
	);
};
