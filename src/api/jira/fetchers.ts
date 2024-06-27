import { jiraAPIInstance } from "./instance";
import type { JiraProject, ProjectCreate, User } from "./types";

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
