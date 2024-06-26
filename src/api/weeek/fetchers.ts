import { weeekAPIInstance } from "./instance";
import type { GetBoardListData, GetProjectsListData } from "./types";

export const getProjectsList = async () => {
  const { data } =
    await weeekAPIInstance.get<GetProjectsListData>("/tm/projects");

  if (data.success) {
    return data;
  }

  throw Error(data.message);
};

export const getBoardList = async ({ projectId }: { projectId: string }) => {
  const { data } =
    await weeekAPIInstance.get<GetBoardListData>("/tm/boards", {
      params: {
        projectId
      }
    });

  if (data.success) {
    return data;
  }

  throw Error(data.message);
}
