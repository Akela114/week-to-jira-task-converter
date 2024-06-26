import { jiraAPIInstance } from "./instance";

export const getProjectsList = async () => {
  const { data } = await jiraAPIInstance.get("/project");

  if (data) {
    return data;
  }

  throw Error(data.message);
};
