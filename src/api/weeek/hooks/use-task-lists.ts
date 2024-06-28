import { useQuery } from "@tanstack/react-query";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";
import { downloadWeekFile, getBoardColumnList, getBoardTaskList } from "../fetchers";

export const useTasksList = (
  { projectId, boardId }: { projectId?: string, boardId?: string }
) => {
  return useQuery({
    queryKey: [WEEEK_QUERY_KEYS.tasksList, { projectId, boardId }],
    queryFn: async () => {
      if (projectId && boardId) {
        const { boardColumns } = await getBoardColumnList({ boardId });
        const { tasks } = await getBoardTaskList({ boardId });
        
        return await Promise.all(tasks.map(async (task) => ({
          ...task,
          boardColumnName: boardColumns.find((column) => column.id === task.boardColumnId)?.name,
          attachments: await Promise.all(
            task.attachments.map(async (attachment) => ({
              ...attachment,
              blob: await downloadWeekFile(attachment.url),
          }))
        )
        })))
      }
    },
    enabled: Boolean(projectId && boardId),
  });
};