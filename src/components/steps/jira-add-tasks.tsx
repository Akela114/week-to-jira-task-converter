import { useTasks, useTransition } from "@/api/jira/hooks/use-tasks";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/shared/ui/button";
import { useAppStore } from "@/store/app-store";
import { Interceptor } from "../interceptor";
import { toast } from "react-toastify";

export const JiraAddTasks = () => {
	const { mutateAsync: addTask } = useTasks();
	const { getTransition, changeTaskStatus } = useTransition();
	const state = useAppStore((state) => state);

	const {
		isReadyAddTasks,
		boardId,
		projectId,
		jiraTasksTypeId,
		jiraProjectId,
		usersMap,
	} = state;
	const { data, status, error } = useTasksList({ projectId, boardId });

	console.log(usersMap, data);

	const onAddTasks = async () => {
		if (!data?.tasks) return;
		if (!jiraProjectId || !jiraTasksTypeId || !usersMap) {
			toast(
				"Не выбран проект или тип задачи в Jira или не сопоставлены пользователи",
				{
					type: "error",
				},
			);
			throw new Error("Не выбран проект или тип Задачи в Jira");
		}
		for (const { userId, description, authorId, title } of data.tasks) {
			const { id } = await addTask({
				fields: {
					// исполнитель
					...(userId && usersMap[userId]
						? {
								assignee: {
									id: usersMap[userId],
								},
							}
						: {}),
					// автор
					...(authorId && usersMap[authorId]
						? {
								reporter: {
									id: usersMap[authorId],
								},
							}
						: {}),
					description: description || "",
					project: {
						id: jiraProjectId,
					},
					// Тип задачи (задача, подзадача, Epic...)
					issuetype: {
						id: jiraTasksTypeId,
					},
					// название задачи
					summary: title,
				},
			});
			const { transitions } = await getTransition(id);

			// берем из сопоставленных категорий id категории жира находим ее в массиве transitions по полям to.id
			// и достаем из найденного объекта transitions transition.id это и будет categoryId
			// await changeTaskStatus({ categoryId: "31", taskId: id });
		}
	};

	return (
		<Interceptor status={status} errorMessage={error?.message}>
			<Button
				variant="default"
				onClick={onAddTasks}
				disabled={!isReadyAddTasks}
				className={cn("cursor-pointer opacity-90 mt-6 ml-5", {
					"opacity-30": !isReadyAddTasks,
				})}
			>
				Добавить задачи
			</Button>
		</Interceptor>
	);
};
