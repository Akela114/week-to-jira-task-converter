import { useQuery } from "@tanstack/react-query";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";
import { getProjectsList } from "../fetchers";

export const useProjectsList = () => {
  return useQuery({
    queryKey: [WEEEK_QUERY_KEYS.projectsList],
    queryFn: getProjectsList,
  });
};

