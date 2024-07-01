import { JIRA_QUERY_KEYS } from "@/lib/constants/query-keys"
import { useQuery } from "@tanstack/react-query"
import { getProjectRoleDetails } from "../fetchers"

export const useProjectUsersByRole = ({projectId, roleId}: {projectId?: string, roleId?: string}) => {
  return useQuery({
    queryKey: [JIRA_QUERY_KEYS.projectRole, {projectId, roleId}],
    queryFn: async () => {
      if (projectId && roleId) {
        return getProjectRoleDetails(projectId, roleId)
      }
    },
    select: (data) => data?.actors.filter((actor) => actor.actorUser).map((actor) => ({
      // biome-ignore lint/style/noNonNullAssertion: filtered earlier
      id: actor.actorUser!.accountId,
      name: actor.displayName,
    })),
    enabled: Boolean(projectId && roleId),
  })
}