import { useQuery } from "@tanstack/react-query";
import { getWorkspaceMembers } from "../fetchers";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";

export const useWorkspaceMembers = () => {
  return useQuery({
    queryKey: [WEEEK_QUERY_KEYS.workspaceMembers],
    queryFn: getWorkspaceMembers,
  });
}