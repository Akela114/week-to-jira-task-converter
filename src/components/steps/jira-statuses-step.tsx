import { useStatuses } from "@/api/jira/hooks/use-projects";
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

export const JiraStatusesStep = () => {
	const jiraProject = useAppStore((state) => state.jiraProjectId);
	const jiraTasksTypeId = useAppStore((state) => state.jiraTasksTypeId);
	const setJiraTasksTypeId = useAppStore((state) => state.setJiraTasksTypeId);
	const resetJiraTasksTypeId = useAppStore(
		(state) => state.resetJiraTasksTypeId,
	);

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
					{/* <Table className="w-max">
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
					</div> */}
				</Interceptor>
			}
			title="Шаг 6. Выбор типа задач, который будет использован при создании задач в Jira"
			isActive={!!jiraProject}
		/>
	);
};
