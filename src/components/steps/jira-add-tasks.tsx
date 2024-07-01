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
		tasksMap,
		setTasksMap,
	} = state;
	const { data, status, error } = useTasksList({ projectId, boardId });
	const { mutateAsync: editParentId } = useEditParentId();

	const onAddTasks = async () => {
		if (!data?.tasks) return;
		if (!jiraProjectId || !jiraTasksTypeId || !usersMap || !statusesMap) {
			toast(
				"Не выбран проект или тип задачи в Jira или не сопоставлены пользователи или статусы",
				{
					type: "error",
				},
			);
			throw new Error("Не выбран проект или тип Задачи в Jira");
		}
		await Promise.all(
			data.tasks.map(
				async ({
					userId,
					description,
					authorId,
					title,
					boardColumnId,
					attachments,
					parentId,
					id: weekTaskId,
				}) => {
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

					setTasksMap({ ...tasksMap, [weekTaskId]: id });

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
				},
			),
		);
		if (!tasksMap) return;
		await Promise.all(
			data.tasks
				.filter(({ parentId }) => parentId)
				.map(async ({ id, parentId }) => {
					if (parentId && id) {
						await editParentId({
							taskId: tasksMap[id],
							parentId: tasksMap[parentId],
						});
					}
				}),
		);
	};

	return (
		<Step
			title="Шаг 8. Загрузка задача в Jira"
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
