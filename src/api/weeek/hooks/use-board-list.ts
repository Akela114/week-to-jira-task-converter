import { useQuery } from "@tanstack/react-query";
import { WEEEK_QUERY_KEYS } from "@/lib/constants/query-keys";
import { getBoardList } from "../fetchers";

export const useBoardList = ({ projectId }: { projectId?: string }) => {
  return useQuery({
    queryKey: [WEEEK_QUERY_KEYS.boardsList, { projectId }],
    queryFn: () => {
      if (projectId) {
        return getBoardList({ projectId })
      }
    },
    enabled: Boolean(projectId),
  });
};

