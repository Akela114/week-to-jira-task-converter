import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/table";
import { ScrollArea } from "@/shared/ui/scroll-area";
import type { FC } from "react";

type WeekTasksTableProps = {
	tasks: {
		id: number;
		name: string;
		status?: string;
		parentId?: number;
		attachments: {
			id: string;
			title: string;
			link: string;
		}[];
	}[];
};

export const WeekTasksTable: FC<WeekTasksTableProps> = ({ tasks }) => {
	const taskRows = tasks.map((task) => (
		<TableRow key={task.id}>
			<TableCell>{task.id}</TableCell>
			<TableCell>{task.name}</TableCell>
			<TableCell>{task.status}</TableCell>
			<TableCell>{task.parentId}</TableCell>
			<TableCell className="text-right">
				{task.attachments.map((attachment) => (
					<a
						href={attachment.link}
						key={attachment.id}
						download
						className="block"
					>
						{attachment.title}
					</a>
				))}
			</TableCell>
		</TableRow>
	));

	return (
		<div className="space-y-[20px]">
			<ScrollArea className="h-fit">
				<div className="max-h-[200px]">
					<Table className="border">
						<TableHeader>
							<TableRow>
								<TableHead>Id</TableHead>
								<TableHead>Название</TableHead>
								<TableHead>Статус</TableHead>
								<TableHead>Id родительской задачи</TableHead>
								<TableHead className="text-right">Вложения</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{taskRows.length ? (
								taskRows
							) : (
								<TableRow>
									<TableCell colSpan={4} className="font-medium">
										Список задач пуст
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</ScrollArea>
		</div>
	);
};
