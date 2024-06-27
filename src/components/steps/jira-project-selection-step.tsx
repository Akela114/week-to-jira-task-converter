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

export const JiraProjectSelectionStep = () => {
	const { data, status, error } = useJiraProjectsList();

	const selectedProjectId = useJiraStore((store) => store.selectedProjectId);
	const setSelectedProjectId = useJiraStore(
		(state) => state.setSelectedProjectId,
	);

	const projectSelectOptions = data?.map((project) => (
		<SelectItem value={String(project.id)} key={project.id}>
			{project.name}
		</SelectItem>
	));

	return (
		<Step
			title="Шаг unknown. Выберите проект в JIRA"
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
			isActive
		/>
	);
};
