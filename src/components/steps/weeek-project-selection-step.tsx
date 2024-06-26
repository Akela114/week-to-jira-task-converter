import { useProjectsList } from "@/api/weeek/hooks/use-projects-list";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from "@/shared/ui/select";
import { Step } from "@/shared/ui/step";
import { useWeeekStore } from "@/store/weeek-store";
import { Interceptor } from "../interceptor";

export const WeekProjectSelectionStep = () => {
	const { data, status, error } = useProjectsList();
	const selectedProjectId = useWeeekStore((state) => state.selectedProjectId);
	const setSelectedProjectId = useWeeekStore(
		(state) => state.setSelectedProjectId,
	);

	const projectSelectOptions = data?.projects.map((project) => (
		<SelectItem value={String(project.id)} key={project.id}>
			{project.title}
		</SelectItem>
	));

	return (
		<Step
			title="Шаг 1. Выберите проект в WEEEK"
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<Select
						onValueChange={setSelectedProjectId}
						value={
							data?.projects.some(
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
			}
			isActive
		/>
	);
};
