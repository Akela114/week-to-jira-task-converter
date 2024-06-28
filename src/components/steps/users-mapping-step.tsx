import { Step } from "@/shared/ui/step";
import { useWeeekStore } from "@/store/weeek-store";
import { Interceptor } from "../interceptor";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { type ComponentProps, useMemo } from "react";
import { useWorkspaceMembers } from "@/api/weeek/hooks/use-workspace-members";
import { useJiraUsers } from "@/api/jira/hooks/use-users";
import { UsersMappingTable } from "../tables/users-mapping-table";

export const UsersMappingStep = () => {
	const projectId = useWeeekStore((state) => state.projectId);
	const boardId = useWeeekStore((state) => state.boardId);
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
	} = useJiraUsers();

	const relatedWeekUsersIds = useMemo(
		() =>
			tasksData && [
				...new Set(
					tasksData?.flatMap((task) => [
						...new Set([task.authorId, ...(task.userId ? [task.userId] : [])]),
					]),
				),
			],
		[tasksData],
	);

	const relatedWeekMembers =
		relatedWeekUsersIds &&
		membersData?.members.filter((member) =>
			relatedWeekUsersIds.includes(member.id),
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

	return (
		<Step
			title="Шаг 4. Сопоставление пользователей из Week пользователям Jira"
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
						weekUsers={
							relatedWeekMembers?.map(({ id, firstName, lastName }) => ({
								id,
								name:
									[
										...(firstName ? [firstName] : []),
										...(lastName ? [lastName] : []),
									].join(" ") || id,
							})) ?? []
						}
						jiraUsers={
							jiraUsers
								?.filter((user) => user.accountType !== "app")
								.map((user) => ({
									id: user.accountId,
									name: user.displayName,
								})) ?? []
						}
					/>
				</Interceptor>
			}
			isActive={Boolean(tasksData)}
		/>
	);
};
