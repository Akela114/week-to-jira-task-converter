import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createProject, getProjectsList } from "../fetchers";
import { withToastMessages } from "@/lib/utils/with-toast-messages";
import { JIRA_QUERY_KEYS } from "@/lib/constants/query-keys";

const TOAST_MESSAGES = {
  success: "Успешная загрузка информации о проектах из JIRA",
  error: "Произошла ошибка при загрузке проектов из JIRA",
  pending: "Загрузка проектов из JIRA...",
} as const;

export const useJiraProjectsList = () => {
  return useQuery({
    queryKey: [JIRA_QUERY_KEYS.projectsList],
    queryFn: () => withToastMessages(getProjectsList, TOAST_MESSAGES)(),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

const TOAST_MESSAGES_CREATE = {
  success: "Проект в Jira успешно создан",
  error: "Произошла ошибка добавления проекта ",
  pending: "Создание проекта...",
} as const;

export const useAddJiraProject = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: withToastMessages(createProject, TOAST_MESSAGES_CREATE),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [JIRA_QUERY_KEYS.projectsList],
      });
    }
  })
}