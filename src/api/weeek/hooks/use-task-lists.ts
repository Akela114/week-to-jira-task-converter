import { useQuery } from "@tanstack/react-query";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";
import { getBoardColumnList, getBoardTaskList } from "../fetchers";
import { withToastMessages } from "@/lib/utils/with-toast-messages";

const BOARD_COLUMNS_FETCHING_TOAST_MESSAGES = {
  success: "Успешная загрузка статусов задач из WEEEK",
  error: "Произошла ошибка при загрузке статусов задач из WEEEK",
  pending: "Загрузка статусов задач из WEEEK...",
} as const;

const TASKS_FETCHING_TOAST_MESSAGES = {
  success: "Успешная загрузка задач из WEEEK",
  error: "Произошла ошибка при загрузке задач из WEEEK",
  pending: "Загрузка задач из WEEEK...",
} as const;

export const useTasksList = (
  { projectId, boardId }: { projectId?: string, boardId?: string }
) => {
  return useQuery({
    queryKey: [WEEEK_QUERY_KEYS.tasksList, { projectId, boardId }],
    queryFn: async () => {
      if (projectId && boardId) {
        const { boardColumns } = await getBoardColumnList({ boardId });
        const { tasks } = await getBoardTaskList({ boardId });
        
        return tasks.map((task) => ({
          ...task,
          boardColumnName: boardColumns.find((column) => column.id === task.boardColumnId)?.name
        }))
      }
    },
    enabled: Boolean(projectId && boardId),
  });
};