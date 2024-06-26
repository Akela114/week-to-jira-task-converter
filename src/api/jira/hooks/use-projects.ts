import { useQuery } from "@tanstack/react-query";
import { getProjectsList } from "../fetchers";
import { withToastMessages } from "@/lib/utils/with-toast-messages";
import { JIRA_QUERY_KEYS } from "../constants/query-keys";

const TOAST_MESSAGES = {
  success: "Успешная загрузка информации о проектах из JIRA",
  error: "Произошла ошибка при загрузке проектов из JIRA",
  pending: "Загрузка проектов из JIRA...",
} as const;

export const useJiraProjectsList = () => {
  return useQuery({
    queryKey: [JIRA_QUERY_KEYS.projectsList],
    queryFn: () => withToastMessages(getProjectsList, TOAST_MESSAGES)(),
  });
};