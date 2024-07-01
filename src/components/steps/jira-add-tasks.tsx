import {
	useEditParentId,
	useTasks,
	useTransition,
} from "@/api/jira/hooks/use-tasks";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/shared/ui/button";
import { useAppStore } from "@/store/app-store";
import { Interceptor } from "../interceptor";
import { toast } from "react-toastify";
import { Step } from "@/shared/ui/step";
import type { Task } from "@/api/weeek/types";

export const JiraAddTasks = () => {
	const { mutateAsync: addTask } = useTasks();
	const { getTransition, changeTaskStatus, addFileInJiraTask } =
		useTransition();
	const state = useAppStore((state) => state);

	const {
		isReadyAddTasks,
		boardId,
		projectId,
		jiraTasksTypeId,
		jiraProjectId,
		usersMap,
		statusesMap,
		jiraSubtasksTypeId,
	} = state;
	const { data, status, error } = useTasksList({ projectId, boardId });
	const { mutateAsync: editParentId } = useEditParentId();

	const onAddTasks = async () => {
		const tasksMapping = new Map();
		if (!data?.tasks) return;
		if (
			!jiraProjectId ||
			!jiraTasksTypeId ||
			!usersMap ||
			!statusesMap ||
			!jiraSubtasksTypeId
		) {
			toast(
				"Не выбран проект или тип задачи в Jira или не сопоставлены пользователи или статусы",
				{
					type: "error",
				},
			);
			throw new Error("Не выбран проект или тип Задачи в Jira");
		}
		let tasksToAdd: typeof data.tasks = data.tasks;
		while (tasksToAdd.length) {
			const tasksToAddCopy: typeof data.tasks = [];
			await Promise.all(
				tasksToAdd.map(async (task) => {
					const {
						userId,
						description,
						authorId,
						title,
						boardColumnId,
						attachments,
						id: weekTaskId,
						parentId,
					} = task;

					if (parentId && !tasksMapping.get(parentId)) {
						tasksToAddCopy.push(task);
						return;
					}

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
								id: parentId ? jiraSubtasksTypeId : jiraTasksTypeId,
							},
							...(parentId && tasksMapping.get(parentId)
								? {
										parent: {
											id: tasksMapping.get(parentId),
										},
									}
								: {}),
							// название задачи
							summary: title,
						},
					});
					tasksMapping.set(weekTaskId, id);

					const { transitions } = await getTransition(id);

					// берем из сопоставленных категорий id категории жира находим ее в массиве transitions по полям to.id
					// и достаем из найденного объекта targetTransitions id это и будет categoryId
					const targetTransition = transitions.find(
						({ to }) => to.id === statusesMap[boardColumnId],
					);

					if (!targetTransition) {
						toast(`Не удалось поменять статус задачи ${title}`, {
							type: "error",
						});
						throw new Error(`Не удалось поменять статус задачи ${title}`);
					}

					await changeTaskStatus({
						categoryId: targetTransition.id,
						taskId: id,
					});

					if (attachments?.length) {
						const formData = new FormData();
						for (const item of attachments) {
							formData.append("file", item.blob, item.name);
						}
						await addFileInJiraTask({ taskId: id, formData });
					}
				}),
			);
			tasksToAdd =
				tasksToAddCopy.length < tasksToAdd.length ? tasksToAddCopy : [];
		}
	};

	return (
		<Step
			title="Шаг 10. Загрузка задача в Jira"
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<Button
						variant="default"
						onClick={onAddTasks}
						disabled={!isReadyAddTasks}
						className={cn("cursor-pointer opacity-90", {
							"opacity-30": !isReadyAddTasks,
						})}
					>
						Добавить задачи
					</Button>
				</Interceptor>
			}
			isActive={isReadyAddTasks}
		/>
	);
};
