import { jiraAPIInstance } from "./instance";
import type { CreateBodyResponse, CreateTaskBody, JiraProject, ProjectCreate, StatusRoot, TransitionForTasks, User } from "./types";

export const getProjectsList = async () => {
  const { data } = await jiraAPIInstance.get<JiraProject[]>("/project");

  return data;
};


export const createProject = async (projectData: ProjectCreate) => {
  const { data } = await jiraAPIInstance.post('/project', {
    ...projectData,
    projectTemplateKey: "com.pyxis.greenhopper.jira:gh-simplified-agility-kanban"
  });
  return data;
}

export const getUsers = async () => {
  const { data } = await jiraAPIInstance.get<User[]>("/users/search");

  return data;
};

export const getStatuses = async (projectId: string) => {
  const { data } = await jiraAPIInstance.get<StatusRoot[]>(`/project/${projectId}/statuses`);

  return data;
};

export const createTask = async (taskData: CreateTaskBody) => {
  const { data } = await jiraAPIInstance.post<CreateBodyResponse>('/issue', taskData);
  return data;
}

export const getTransition = async (issueIdOrKey: string) => {
  const { data } = await jiraAPIInstance.get<TransitionForTasks>(`issue/${issueIdOrKey}/transitions`);
  return data;
}

export const changeTaskStatus = async (issueIdOrKey: string, categoryId: string ) => {
  const { data } = await jiraAPIInstance.post(`issue/${issueIdOrKey}/transitions`, {transition: { id: categoryId, looped: false }})
  return data
}

export const addJiraFileInTask = async (taskId: string, formData: FormData) => {
	const { data } = await jiraAPIInstance.post(`/issue/${taskId}/attachments`, formData, {
    headers: {
      "X-Atlassian-Token": "no-check"
    }
  });
  return data;
}