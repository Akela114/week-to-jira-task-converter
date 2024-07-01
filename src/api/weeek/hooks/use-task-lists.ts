import { useQuery } from "@tanstack/react-query";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";
import {
	downloadWeekFile,
	getBoardColumnList,
	getBoardParentTaskList,
	getTaskById,
} from "../fetchers";
import type { Task } from "../types";

const getSubtasks = async ({subTasks, boardColumnId}: Task): Promise<Task[]> => {
  if (subTasks?.length) {
    const subtasksData = await Promise.all(subTasks.map(async (taskId) => {
      const { task } = await getTaskById({ taskId });
      return {
        ...task,
        boardColumnId,
      };
    }));

    return [
      ...subtasksData,
      ...(await Promise.all(subtasksData.map(getSubtasks))).flat(),
    ]
  }

  return [];
};

export const useTasksList = ({
	projectId,
	boardId,
}: { projectId?: string; boardId?: string }) => {
	return useQuery({
		queryKey: [WEEEK_QUERY_KEYS.tasksList, { projectId, boardId }],
		queryFn: async () => {
			if (projectId && boardId) {
				const { boardColumns } = await getBoardColumnList({ boardId });
				const { tasks } = await getBoardParentTaskList({ boardId });
        
        const tasksWithSubtasks = [
          ...tasks,
          ...(await Promise.all(tasks.map(getSubtasks))).flat(),
        ]

				return {
					boardColumns,
					tasks: await Promise.all(
						tasksWithSubtasks.map(async (task) => ({
							...task,
							boardColumnName: boardColumns.find(
								(column) => column.id === task.boardColumnId,
							)?.name,
							attachments: await Promise.all(
								task.attachments.map(async (attachment) => ({
									...attachment,
									blob: await downloadWeekFile(attachment.url),
								})),
							),
						})),
					),
				};
			}
		},
		enabled: Boolean(projectId && boardId),
	});
};
