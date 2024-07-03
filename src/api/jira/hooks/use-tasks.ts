import { useMutation, useQuery } from "@tanstack/react-query"
import { addJiraComment, addJiraFileInTask, changeTaskStatus, createTask, getAllPriority, getTransition } from "../fetchers"
import { JIRA_QUERY_KEYS } from "@/lib/constants/query-keys"


export const useTasks = () => {
  return useMutation({
    mutationFn: createTask,
  })
}

export const useTaskPriority = () => {
  return useQuery({
    queryFn: getAllPriority,
    queryKey: [JIRA_QUERY_KEYS.priority]
  })
}


export const useTransition = () => {
  const {mutateAsync} = useMutation({
    mutationFn: (taskId: string) => getTransition(taskId)
  })

  const {mutateAsync: changeTask} = useMutation({
    mutationFn: ({taskId, categoryId}: {taskId: string, categoryId: string}) => changeTaskStatus(taskId, categoryId )
  })

  const {mutateAsync: addFileInJiraTask} = useMutation({
    mutationFn: ({taskId, formData}: {taskId: string, formData: FormData}) => addJiraFileInTask(taskId, formData )
  })

  const {mutateAsync: addComment} = useMutation({
    mutationFn: ({taskId, comment}: {taskId: string, comment: string}) => addJiraComment(taskId, comment)
  })

  return { getTransition: mutateAsync, changeTaskStatus: changeTask, addFileInJiraTask, addComment };
}