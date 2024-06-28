import { Step } from "@/shared/ui/step";
import { useWeeekStore } from "@/store/weeek-store";
import { Interceptor } from "../interceptor";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { type ComponentProps, useMemo } from "react";
import { useWorkspaceMembers } from "@/api/weeek/hooks/use-workspace-members";
import { useJiraUsers } from "@/api/jira/hooks/use-users";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { useJiraStore } from "@/store/jira-store";

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

	const selectedJiraUser = useJiraStore((store) => store.selectedJiraUser);
	const setSelectedJiraUser = useJiraStore(
		(store) => store.setSelectedJiraUser,
	);

	const selectedWeeekUser = useWeeekStore((store) => store.userId);
	const setSelectedWeeekUser = useWeeekStore((store) => store.setUserId);

	const relatedUsers = useMemo(
		() =>
			tasksData &&
			membersData &&
			[
				...new Set(
					tasksData?.flatMap((task) => [
						...new Set([task.authorId, ...(task.userId ? [task.userId] : [])]),
					]),
				),
			].map((userId) => {
				const member = membersData.members?.find(
					(member) => member.id === userId,
				);
				return member ? `${member.firstName} ${member.lastName}` : userId;
			}),
		[tasksData, membersData],
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

	const jiraUserSelectOptions = jiraUsers
		?.filter(({ accountType }) => accountType !== "app")
		.map((user) => (
			<SelectItem value={String(user?.accountId)} key={user?.accountId}>
				{user?.displayName}
			</SelectItem>
		));

	const weeekUserSelectedOptions = membersData?.members?.map((user) => (
		<SelectItem value={String(user?.id)} key={user?.id}>
			{user?.firstName} {user.lastName}
		</SelectItem>
	));

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
					<div className="flex gap-4">
						<div className="w-[180px]">
							<Select
								onValueChange={setSelectedWeeekUser}
								value={
									membersData?.members?.some(
										(user) => String(user.id) === selectedWeeekUser,
									)
										? selectedWeeekUser
										: undefined
								}
							>
								<SelectTrigger className="w-full text-xs">
									<SelectValue placeholder="Пользователь WEEEK" />
								</SelectTrigger>
								<SelectContent>{weeekUserSelectedOptions}</SelectContent>
							</Select>
						</div>
						<div className="w-[180px]">
							<Select
								onValueChange={setSelectedJiraUser}
								value={
									jiraUsers?.some(
										(user) => String(user.accountId) === selectedJiraUser,
									)
										? selectedJiraUser
										: undefined
								}
							>
								<SelectTrigger className="w-full text-xs">
									<SelectValue placeholder="Пользователь JIRA" />
								</SelectTrigger>
								<SelectContent>{jiraUserSelectOptions}</SelectContent>
							</Select>
						</div>
					</div>
				</Interceptor>
			}
			isActive={Boolean(tasksData)}
		/>
	);
};
