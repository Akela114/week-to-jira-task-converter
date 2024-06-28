import { useTasks, useTransition } from "@/api/jira/hooks/use-tasks";
import { Button } from "@/shared/ui/button";

export const JiraAddTasks = () => {
	const { mutateAsync: addTask } = useTasks();
	const { getTransition, changeTaskStatus } = useTransition();

	const onAddTasks = async () => {
		const { id } = await addTask({
			fields: {
				assignee: {
					// id исполнителя
					id: "712020:696f264a-b595-4955-bd2a-920e497d4296",
				},
				description: "Новая супер Интерестная задача",
				project: {
					id: "10001",
				},
				// Тип задачи (задача, подзадача, Epic...)
				issuetype: {
					id: "10005",
				},
				// название задачи
				summary: "Новая",
			},
		});

		const { transitions } = await getTransition(id);

		// берем из сопоставленных категорий id категории жира находим ее в массиве transitions по полям to.id
		// и достаем из найденного объекта transitions transition.id это и будет categoryId
		await changeTaskStatus({ categoryId: "31", taskId: id });
	};

	return (
		<div>
			<Button variant="default" onClick={onAddTasks}>
				Добавить задачи
			</Button>
		</div>
	);
};
