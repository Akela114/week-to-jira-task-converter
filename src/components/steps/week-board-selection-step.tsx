import { useBoardList } from "@/api/weeek/hooks/use-board-list";
import { Step } from "@/shared/ui/step";
import { useWeeekStore } from "@/store/weeek-store";
import { Interceptor } from "../interceptor";
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from "@/shared/ui/select";

export const WeekBoardSelectionStep = () => {
	const projectId = useWeeekStore((state) => state.projectId);
	const { data, status, error } = useBoardList({ projectId });
	const boardId = useWeeekStore((state) => state.boardId);
	const setBoardId = useWeeekStore((state) => state.setBoardId);
	const resetBoardId = useWeeekStore((state) => state.resetBoardId);

	const boardSelectOptions = data?.boards.map((board) => (
		<SelectItem value={String(board.id)} key={board.id}>
			{board.name}
		</SelectItem>
	));

	if (
		status === "success" &&
		!data?.boards.some((board) => String(board.id) === boardId)
	) {
		resetBoardId();
	}

	return (
		<Step
			title="Шаг 2. Выберите доску"
			content={
				<Interceptor status={status} errorMessage={error?.message}>
					<Select
						onValueChange={setBoardId}
						value={
							data?.boards.some((board) => String(board.id) === boardId)
								? boardId
								: undefined
						}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Выберите проект" />
						</SelectTrigger>
						<SelectContent>{boardSelectOptions}</SelectContent>
					</Select>
				</Interceptor>
			}
			isActive={Boolean(projectId)}
		/>
	);
};
