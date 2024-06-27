import { jiraAPIInstance } from "./instance";
import type { JiraProject, ProjectCreate, StatusRoot, User } from "./types";

export const getProjectsList = async () => {
  const { data } = await jiraAPIInstance.get<JiraProject[]>("/project");

  return data;
};


export const createProject = async (projectData: ProjectCreate) => {
  const { data } = await jiraAPIInstance.post('/project', projectData);
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