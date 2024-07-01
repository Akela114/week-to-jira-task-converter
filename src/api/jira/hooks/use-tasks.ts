import { useMutation } from "@tanstack/react-query"
import { addJiraFileInTask, changeTaskStatus, createTask, getTransition, linkParentIdForTask } from "../fetchers"
import type { CreateTaskBody } from "../types"
import { withToastMessages } from "@/lib/utils/with-toast-messages"

const TOAST_MESSAGE = {
  success: "Задача успешно добавлена",
  pending: "Добаление задачи",
  error: "Ошибка добавления задачи"
}

export const useTasks = () => {
  return useMutation({
    mutationFn: withToastMessages((data: CreateTaskBody) => createTask(data), TOAST_MESSAGE),
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

  return { getTransition: mutateAsync, changeTaskStatus: changeTask, addFileInJiraTask };
}

export const useEditParentId = () => useMutation({
  mutationFn: (({ taskId, parentId }: {taskId: string, parentId: string}) => linkParentIdForTask(taskId, parentId))
})