import { weeekAPIInstance } from "./instance";
import type { GetProjectsListData } from "./types";

export const getProjectsList = async () => {
  const { data } =
    await weeekAPIInstance.get<GetProjectsListData>("/tm/projects");

  if (data.success) {
    return data;
  }

  throw Error(data.message);
};
