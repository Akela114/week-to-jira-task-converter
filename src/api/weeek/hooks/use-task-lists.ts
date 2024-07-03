import { useQuery } from "@tanstack/react-query";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";
import {
	downloadWeekFile,
	getBoardColumnList,
	getBoardParentTaskList,
	getTaskById,
	getWeeekComments,
} from "../fetchers";
import type { Task } from "../types";
import { transformWeekCommentToJira } from "@/lib/utils/transform-weeek-comment-to-jira";
import TurndownService from 'turndown';

const turndownService = new TurndownService()

const getSubtasks = async ({subTasks, boardColumnId}: Task): Promise<Task[]> => {
  if (subTasks?.length) {
    const subtasksData = await Promise.all(subTasks.map(async (taskId) => {
      const { task } = await getTaskById({ taskId });
      return {
        ...task,
        boardColumnId,
      };
    }));

    return subtasksData
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
				const tasksWithoutDuplicatedSubtasks = tasks.map((task) => ({
					...task,
					subTasks: task.subTasks.filter((taskId) => !tasks.some((t) => t.id === taskId)),
				}))
        
        const tasksWithSubtasks = [
          ...tasksWithoutDuplicatedSubtasks,
          ...(await Promise.all(tasksWithoutDuplicatedSubtasks.map(getSubtasks))).flat(),
        ]

				return {
					boardColumns,
					tasks: await Promise.all(
						tasksWithSubtasks.map(async (task) => ({
							...task,
							description: turndownService.turndown(task.description ?? ""),
							boardColumnName: boardColumns.find(
								(column) => column.id === task.boardColumnId,
							)?.name,
							attachments: await Promise.all(
								task.attachments.map(async (attachment) => ({
									...attachment,
									blob: await downloadWeekFile(attachment.url),
								})),
							),
							comments: await getWeeekComments(task.id)
								.then((comments) => comments.map(
									(comment) => {
										const transformedComment = transformWeekCommentToJira(comment.content.data.content)
										return `*${comment.user.name} (WEEEK):*\n${transformedComment}`
									})
							),
						})),
					),
				};
			}
		},
		enabled: Boolean(projectId && boardId),
	});
};
