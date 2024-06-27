import { Step } from "@/shared/ui/step";
import { useWeeekStore } from "@/store/weeek-store";
import { Interceptor } from "../interceptor";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { WeekTasksTable } from "../tables/week-tasks-table";

export const WeekTaskFetchingStep = () => {
	const projectId = useWeeekStore((state) => state.projectId);
	const boardId = useWeeekStore((state) => state.boardId);
	const { data, status, error } = useTasksList({ projectId, boardId });

	return (
		<Step
			title="Шаг 3. Загрузка задач"
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<WeekTasksTable
						title={
							data
								? `Всего: задачи - ${data.length}, вложения - ${data.reduce(
										(sum, task) => sum + task.attachments.length,
										0,
									)}`
								: undefined
						}
						tasks={
							data?.map((task) => ({
								id: task.id,
								name: task.title,
								status: task.boardColumnName,
								attachments: task.attachments.map((attachment) => ({
									id: attachment.id,
									title: attachment.name,
									link: attachment.url,
								})),
							})) ?? []
						}
					/>
				</Interceptor>
			}
			isActive={Boolean(projectId && boardId)}
		/>
	);
};
