import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../fetchers";
import { withToastMessages } from "@/lib/utils/with-toast-messages";
import { JIRA_QUERY_KEYS } from "@/lib/constants/query-keys";

const TOAST_MESSAGES = {
  success: "Успешная загрузка информации о пользователях из JIRA",
  error: "Произошла ошибка при загрузке пользователей из JIRA",
  pending: "Загрузка пользователей из JIRA...",
} as const;

export const useJiraUsers = () => {
  return useQuery({
    queryKey: [JIRA_QUERY_KEYS.users],
    queryFn: () => withToastMessages(getUsers, TOAST_MESSAGES)(),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
