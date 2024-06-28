import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/table";
import type { FC } from "react";

type WeekTasksTableProps = {
	title?: string;
	tasks: {
		id: number;
		name: string;
		status?: string;
		attachments: {
			id: string;
			title: string;
			link: string;
		}[];
	}[];
};

export const WeekTasksTable: FC<WeekTasksTableProps> = ({ title, tasks }) => {
	const taskRows = tasks.map((task) => (
		<TableRow key={task.id}>
			<TableCell>{task.id}</TableCell>
			<TableCell>{task.name}</TableCell>
			<TableCell>{task.status}</TableCell>
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
		<Table>
			{title && <TableCaption className="text-start">{title}</TableCaption>}
			<TableHeader>
				<TableRow>
					<TableHead>Id</TableHead>
					<TableHead>Название</TableHead>
					<TableHead>Статус</TableHead>
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
	);
};
