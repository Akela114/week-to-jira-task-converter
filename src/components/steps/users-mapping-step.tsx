import { Step } from "@/shared/ui/step";
import { useAppStore } from "@/store/app-store";
import { Interceptor } from "../interceptor";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { type ComponentProps, useMemo } from "react";
import { useWorkspaceMembers } from "@/api/weeek/hooks/use-workspace-members";
import { UsersMappingTable } from "../tables/users-mapping-table";
import { useProjectUsersByRole } from "@/api/jira/hooks/use-project-users-by-role";

export const UsersMappingStep = () => {
	const jiraProjectId = useAppStore((state) => state.jiraProjectId);
	const jiraRoleId = useAppStore((state) => state.jiraRoleId);
	const projectId = useAppStore((state) => state.projectId);
	const boardId = useAppStore((state) => state.boardId);

	const {
		data: tasksData,
		status: tasksStatus,
		error: tasksError,
	} = useTasksList({ projectId, boardId });
	const {
		data: membersData,
		status: membersStatus,
		error: membersError,
	} = useWorkspaceMembers();

	const {
		data: jiraUsers,
		error: userJiraError,
		status: userJiraStatus,
	} = useProjectUsersByRole({ projectId: jiraProjectId, roleId: jiraRoleId });

	const relatedWeekUsersIds = useMemo(
		() =>
			tasksData && [
				...new Set(
					tasksData?.tasks.flatMap((task) => [
						...new Set([task.authorId, ...(task.userId ? [task.userId] : [])]),
					]),
				),
			],
		[tasksData],
	);

	let globalStatus: ComponentProps<typeof Interceptor>["status"];
	if (
		tasksStatus === "error" ||
		membersStatus === "error" ||
		userJiraStatus === "error"
	) {
		globalStatus = "error";
	} else if (
		tasksStatus === "pending" ||
		membersStatus === "pending" ||
		userJiraStatus === "pending"
	) {
		globalStatus = "pending";
	} else {
		globalStatus = "success";
	}

	const weeekUsers = useMemo(
		() =>
			(
				relatedWeekUsersIds &&
				membersData?.members.filter((member) =>
					relatedWeekUsersIds.includes(member.id),
				)
			)?.map(({ id, firstName, lastName }) => ({
				id,
				name:
					[
						...(firstName ? [firstName] : []),
						...(lastName ? [lastName] : []),
					].join(" ") || id,
			})) ?? [],
		[relatedWeekUsersIds, membersData],
	);

	return (
		<Step
			title="Шаг 6. Сопоставление пользователей из Weeek пользователям Jira"
			content={
				<Interceptor
					status={globalStatus}
					errorMessage={
						tasksError?.message ??
						membersError?.message ??
						userJiraError?.message
					}
				>
					<UsersMappingTable
						weekUsers={weeekUsers}
						jiraUsers={jiraUsers ?? []}
					/>
				</Interceptor>
			}
			isActive={Boolean(jiraProjectId && jiraRoleId)}
		/>
	);
};
