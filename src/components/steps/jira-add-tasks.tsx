import { useTasks, useTransition } from "@/api/jira/hooks/use-tasks";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/shared/ui/button";
import { useAppStore } from "@/store/app-store";
import { Interceptor } from "../interceptor";
import { toast } from "react-toastify";
import { Step } from "@/shared/ui/step";
import { withToastMessages } from "@/lib/utils/with-toast-messages";

const getToastMessages = (count: number, total: number) => ({
	success: `Задача успешно добавлена (${count}/${total})`,
	pending: `Добавление задачи (${count}/${total})`,
	error: "Ошибка добавления задачи",
});

export const JiraAddTasks = () => {
	const { mutateAsync: addTask } = useTasks();
	const { getTransition, changeTaskStatus, addFileInJiraTask, addComment } =
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

		const logs = {
			project: {
				weeek: {
					projectId,
					boardId,
				},
				jira: {
					projectId: jiraProjectId,
					coreTasksTypeId: jiraTasksTypeId,
					subtasksTypeId: jiraSubtasksTypeId,
				},
			},
			statusesMap,
			usersMap,
			tasksInfo: {} as Record<
				string,
				| {
						jiraTaskId?: string;
						status: "skipped" | "failed";
				  }
				| {
						jiraTaskId: string;
						status: "success";
				  }
				| {
						jiraTaskId?: string;
						status: "failed";
						failureStage:
							| "creation"
							| "status-update"
							| "comments-append"
							| "attachments-append";
				  }
			>,
		};

		let tasksToAdd: typeof data.tasks = data.tasks;
		let counter = 1;
		while (tasksToAdd.length) {
			const tasksToAddCopy = [];
			for (let idx = 0; idx < tasksToAdd.length; idx++) {
				const taskToAdd = tasksToAdd[idx];
				logs.tasksInfo[taskToAdd.id] = {
					status: "skipped",
				};

				if (taskToAdd.parentId && !tasksMapping.get(taskToAdd.parentId)) {
					tasksToAddCopy.push(taskToAdd);
					continue;
				}
				try {
					await withToastMessages(
						async () => {
							const {
								userId,
								description,
								authorId,
								title,
								boardColumnId,
								attachments,
								id: weekTaskId,
								parentId,
								comments,
							} = taskToAdd;

							try {
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
								logs.tasksInfo[weekTaskId] = {
									jiraTaskId: id,
									status: "skipped",
								};
							} catch (err) {
								logs.tasksInfo[weekTaskId] = {
									status: "failed",
									failureStage: "creation",
								};
								throw err;
							}

							const id = tasksMapping.get(weekTaskId);
							try {
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
							} catch (err) {
								logs.tasksInfo[weekTaskId] = {
									jiraTaskId: id,
									status: "failed",
									failureStage: "status-update",
								};
								throw err;
							}

							try {
								for (const comment of comments) {
									await addComment({ taskId: id, comment });
								}
							} catch (err) {
								logs.tasksInfo[weekTaskId] = {
									jiraTaskId: id,
									status: "failed",
									failureStage: "comments-append",
								};
								throw err;
							}

							try {
								if (attachments?.length) {
									const formData = new FormData();
									for (const item of attachments) {
										formData.append("file", item.blob, item.name);
									}
									await addFileInJiraTask({ taskId: id, formData });
								}
								logs.tasksInfo[weekTaskId] = {
									jiraTaskId: id,
									status: "success",
								};
							} catch (err) {
								logs.tasksInfo[weekTaskId] = {
									jiraTaskId: id,
									status: "failed",
									failureStage: "attachments-append",
								};
								throw err;
							}
						},
						getToastMessages(counter++, data.tasks.length),
					)();
				} catch {}
			}
			tasksToAdd =
				tasksToAddCopy.length < tasksToAdd.length ? tasksToAddCopy : [];
		}
		const blob = new Blob([JSON.stringify(logs, null, 2)], {
			type: "application/json",
		});
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = href;
		link.download = "logs.json";
		link.click();
		document.body.removeChild(link);
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
