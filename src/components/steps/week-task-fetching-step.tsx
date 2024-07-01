import { Step } from "@/shared/ui/step";
import { useAppStore } from "@/store/app-store";
import { Interceptor } from "../interceptor";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { WeekTasksTable } from "../tables/week-tasks-table";

export const WeekTaskFetchingStep = () => {
	const projectId = useAppStore((state) => state.projectId);
	const boardId = useAppStore((state) => state.boardId);
	const { data, status, error } = useTasksList({ projectId, boardId });

	return (
		<Step
			title="Шаг 3. Загрузка задач"
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<WeekTasksTable
						tasks={
							data?.tasks.map((task) => ({
								id: task.id,
								name: task.title,
								status: task.boardColumnName,
								parentId: task.parentId,
								attachments: task.attachments.map((attachment) => ({
									id: attachment.id,
									title: attachment.name,
									link: attachment.url,
								})),
							})) ?? []
						}
					/>
					<div>
						{data
							? `Найдено: задачи - ${data.tasks.length}, вложения - ${data.tasks.reduce(
									(sum, task) => sum + task.attachments.length,
									0,
								)}`
							: undefined}
					</div>
				</Interceptor>
			}
			isActive={Boolean(projectId && boardId)}
		/>
	);
};
