import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../fetchers";
import { JIRA_QUERY_KEYS } from "@/lib/constants/query-keys";

export const useJiraUsers = () => {
  return useQuery({
    queryKey: [JIRA_QUERY_KEYS.users],
    queryFn: getUsers,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};
