import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjectsList, getStatuses } from "../fetchers";
import { withToastMessages } from "@/lib/utils/with-toast-messages";
import { JIRA_QUERY_KEYS } from "@/lib/constants/query-keys";

export const useJiraProjectsList = () => {
  return useQuery({
    queryKey: [JIRA_QUERY_KEYS.projectsList],
    queryFn: getProjectsList,
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withToastMessages(createProject, TOAST_MESSAGES_CREATE),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [JIRA_QUERY_KEYS.projectsList],
      });
    }
  })
}

export const useStatuses = (projectId: string | undefined) => {
  return useQuery({
    queryKey: [JIRA_QUERY_KEYS.projectStatuses, projectId] as const,
    queryFn: () => (() => getStatuses(projectId as string))(),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !!projectId
  });
}