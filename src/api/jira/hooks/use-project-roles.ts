import { JIRA_QUERY_KEYS } from "@/lib/constants/query-keys"
import { useQuery } from "@tanstack/react-query"
import { getProjectRoles } from "../fetchers"

export const useProjectRoles = ({projectId} : {projectId?: string}) => {
  return useQuery({
    queryKey: [JIRA_QUERY_KEYS.projectRoles, {projectId}],
    queryFn: () => {
      if (projectId) {
        return getProjectRoles(projectId)
      }
    },
    select: (data) => data && Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, value.split("/").at(-1) as string])
    ),
    enabled: Boolean(projectId)
  })
}