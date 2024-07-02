import { jiraAPIInstance } from "./instance";
import type {
	GetProjectDetailsResponse,
	CreateBodyResponse,
	CreateTaskBody,
	GetProjectRolesResponse,
	JiraProject,
	ProjectCreate,
	StatusRoot,
	TransitionForTasks,
	User,
} from "./types";

export const getProjectsList = async () => {
	const { data } = await jiraAPIInstance.get<JiraProject[]>("/project");

	return data;
};

export const createProject = async (projectData: ProjectCreate) => {
	const { data } = await jiraAPIInstance.post("/project", {
		...projectData,
		projectTemplateKey:
			"com.pyxis.greenhopper.jira:gh-simplified-agility-kanban",
	});
	return data;
};

export const getUsers = async () => {
	const { data } = await jiraAPIInstance.get<User[]>("/users/search");

	return data;
};

export const getProjectRoles = async (projectId: string) => {
	const { data } = await jiraAPIInstance.get<GetProjectRolesResponse>(
		`/project/${projectId}/role`,
	);

	return data;
};

export const getProjectRoleDetails = async (
	projectId: string,
	roleId: string,
) => {
	const { data } = await jiraAPIInstance.get<GetProjectDetailsResponse>(
		`/project/${projectId}/role/${roleId}`,
	);
	return data;
};

export const getStatuses = async (projectId: string) => {
	const { data } = await jiraAPIInstance.get<StatusRoot[]>(
		`/project/${projectId}/statuses`,
	);

	return data;
};

export const createTask = async (taskData: CreateTaskBody) => {
	const { data } = await jiraAPIInstance.post<CreateBodyResponse>(
		"/issue",
		taskData,
	);
	return data;
};

export const getTransition = async (issueIdOrKey: string) => {
	const { data } = await jiraAPIInstance.get<TransitionForTasks>(
		`issue/${issueIdOrKey}/transitions`,
	);
	return data;
};

export const changeTaskStatus = async (issueIdOrKey: string, categoryId: string ) => {
  const { data } = await jiraAPIInstance
    .post(`issue/${issueIdOrKey}/transitions`, {transition: { id: categoryId, looped: false }})
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

export const linkParentIdForTask = async (taskId: string, parentTaskId: string) => {
  const { data } = await jiraAPIInstance.put(`issue/${taskId}`, {
    fields: {
      parent: {
        id: parentTaskId
      }
    }
  })
  return data;
}

export const addJiraComment = async (taskId: string, comment: string) => {
	const { data } = await jiraAPIInstance.post(`/issue/${taskId}/comment`, {
		body: comment
	})
	return data;
}