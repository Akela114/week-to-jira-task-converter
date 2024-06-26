import { useQuery } from "@tanstack/react-query";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";
import { getBoardList } from "../fetchers";
import { withToastMessages } from "@/lib/utils/with-toast-messages";

const TOAST_MESSAGES = {
  success: "Успешная загрузка информации о досках из WEEEK",
  error: "Произошла ошибка при загрузке досок из WEEEK",
  pending: "Загрузка досок из WEEEK...",
} as const;

export const useBoardList = (parameters: Parameters<typeof getBoardList>[0]) => {
  return useQuery({
    queryKey: [WEEEK_QUERY_KEYS.projectsList, parameters],
    queryFn: () => withToastMessages(getBoardList, TOAST_MESSAGES)(parameters),
  });
};

