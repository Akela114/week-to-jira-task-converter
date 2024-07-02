import axios from "axios";
import { weeekAPIInstance } from "./instance";
import {
	type GetWorkspaceMembers,
	type GetBoardColumnListData,
	type GetBoardColumnTaskList,
	type GetBoardListData,
	type GetProjectsListData,
	type GetBoardTask,
	type GetWeeekComments,
	getWeeekCommentsSchema,
} from "./types";

export const getProjectsList = async () => {
	const { data } =
		await weeekAPIInstance.get<GetProjectsListData>("/tm/projects");

	if (data.success) {
		return data;
	}

	throw Error(data.message);
};

export const getBoardList = async ({ projectId }: { projectId: string }) => {
	const { data } = await weeekAPIInstance.get<GetBoardListData>("/tm/boards", {
		params: {
			projectId,
		},
	});

	if (data.success) {
		return data;
	}

	throw Error(data.message);
};

export const getBoardColumnList = async ({ boardId }: { boardId: string }) => {
	const { data } = await weeekAPIInstance.get<GetBoardColumnListData>(
		"/tm/board-columns",
		{
			params: {
				boardId,
			},
		},
	);

	if (data.success) {
		return data;
	}

	throw Error(data.message);
};

export const getBoardParentTaskList = async ({ boardId }: { boardId: string }) => {
	const { data } = await weeekAPIInstance.get<GetBoardColumnTaskList>(
		"/tm/tasks",
		{
			params: {
				boardId,
				all: 1
			},
		},
	);

	if (data.success) {
		return data;
	}

	throw Error(data.message);
};

export const getTaskById = async ({ taskId }: { taskId: number }) => {
	const { data } = await weeekAPIInstance.get<GetBoardTask>(
		`/tm/tasks/${taskId}`
	);

	if (data.success) {
		return data;
	}

	throw Error(data.message);
}

export const getWorkspaceMembers = async () => {
	const { data } =
		await weeekAPIInstance.get<GetWorkspaceMembers>("/ws/members");

	if (data.success) {
		return data;
	}

	throw Error(data.message);
};

export const downloadWeekFile = async (url: string) => {
  const { data } = await axios.get<Blob>(
		`/week-ws${url.replace("https://api.weeek.net/ws", "")}`, {
			responseType: "blob",
		}
	);
	
	return data;
};

export const getWeeekComments = async (taskId: number) => {
  const { data } = await axios.get<GetWeeekComments>(
		`/week-ws/${import.meta.env.VITE_WEEEK_WORKSPACE_ID}/tm/tasks/${taskId}`, {
			withCredentials: true,
		}
	);

	if (data.success) {
		const parsedData = getWeeekCommentsSchema.safeParse(data);
		if (parsedData.success) {
			return parsedData.data.task.comments;
		}
		console.log(parsedData.error.message);
		throw Error("Данные не прошли валидацию");
	}
	
	throw Error(data.message);
};