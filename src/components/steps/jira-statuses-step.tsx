import { useStatuses } from "@/api/jira/hooks/use-projects";
import { Step } from "@/shared/ui/step";
import { Interceptor } from "../interceptor";
import { useJiraStore } from "@/store/jira-store";
import {
	Table,
	TableBody,
	TableCell,
	TableCaption,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";

export const JiraStatusesStep = () => {
	const jiraProject = useJiraStore((state) => state.selectedProjectId);

	const setSelectedTypeTasks = useJiraStore(
		(state) => state.setSelectedTypeTasks,
	);
	const selectedTypeTaskId = useJiraStore((state) => state.selectedTaskType);

	const { data, error, status, refetch } = useStatuses(jiraProject);

	const TypeSelectOptions = data?.map((type) => (
		<SelectItem value={String(type.id)} key={type.id}>
			{type.name}
		</SelectItem>
	));

	return (
		<Step
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<Select
						onValueChange={setSelectedTypeTasks}
						value={
							data?.some((type) => String(type.id) === selectedTypeTaskId)
								? selectedTypeTaskId
								: undefined
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Выберите тип задач для jira" />
						</SelectTrigger>
						<SelectContent>{TypeSelectOptions}</SelectContent>
					</Select>
					<Table className="w-max">
						<TableCaption>Статусы из JIRA</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead className="text-right">Название</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data
								?.find(({ id }) => selectedTypeTaskId === id)
								?.statuses?.map((status) => (
									<TableRow key={status.id}>
										<TableCell>{status.id}</TableCell>
										<TableCell className="text-right">{status.name}</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
					<div className="flex gap-2 items-center text-xs">
						<p className="text-center">
							Если необходимо, редактируйте <br /> колонки в интерфейсе JIRA и{" "}
						</p>
						<Button variant="outline" onClick={() => refetch()}>
							Обновить
						</Button>
					</div>
				</Interceptor>
			}
			title="Шаг unknown. Сопоставление колонок"
			isActive
		/>
	);
};
