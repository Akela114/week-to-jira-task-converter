import { Step } from "@/shared/ui/step";
import { useWeeekStore } from "@/store/weeek-store";
import { Interceptor } from "../interceptor";
import { useTasksList } from "@/api/weeek/hooks/use-task-lists";
import { type ComponentProps, useMemo } from "react";
import { useWorkspaceMembers } from "@/api/weeek/hooks/use-workspace-members";

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
	if (tasksStatus === "error" || membersStatus === "error") {
		globalStatus = "error";
	} else if (tasksStatus === "pending" || membersStatus === "pending") {
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
					errorMessage={tasksError?.message ?? membersError?.message}
				>
					{JSON.stringify(relatedUsers)}
				</Interceptor>
			}
			isActive={Boolean(tasksData)}
		/>
	);
};
