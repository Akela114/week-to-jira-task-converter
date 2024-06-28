import { weeekAPIInstance } from "./instance";
import type {
	GetWorkspaceMembers,
	GetBoardColumnListData,
	GetBoardColumnTaskList,
	GetBoardListData,
	GetProjectsListData,
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

export const getBoardTaskList = async ({ boardId }: { boardId: string }) => {
	const { data } = await weeekAPIInstance.get<GetBoardColumnTaskList>(
		"/tm/tasks",
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

export const getWorkspaceMembers = async () => {
	const { data } =
		await weeekAPIInstance.get<GetWorkspaceMembers>("/ws/members");

	if (data.success) {
		return data;
	}

	throw Error(data.message);
};
