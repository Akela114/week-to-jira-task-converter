import { useQuery } from "@tanstack/react-query";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";
import { getProjectsList } from "../fetchers";
import { withToastMessages } from "@/lib/utils/with-toast-messages";

const TOAST_MESSAGES = {
  success: "Успешная загрузка информации о проектах из WEEEK",
  error: "Произошла ошибка при загрузке проектов из WEEEK",
  pending: "Загрузка проектов из WEEEK...",
} as const;

export const useProjectsList = () => {
  return useQuery({
    queryKey: [WEEEK_QUERY_KEYS.projectsList],
    queryFn: () => withToastMessages(getProjectsList, TOAST_MESSAGES)(),
  });
};

