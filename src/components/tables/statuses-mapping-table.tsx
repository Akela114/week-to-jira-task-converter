import { Select } from "@/shared/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui/table";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";
import { useEffect, useMemo, type FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/shared/ui/form";
import { useAppStore } from "@/store/app-store";

type UsersMappingTableProps = {
	weekStatuses: {
		id: string;
		name?: string;
	}[];
	jiraStatuses: {
		id: string;
		name?: string;
	}[];
};

export const StatusesMappingTable: FC<UsersMappingTableProps> = ({
	weekStatuses,
	jiraStatuses,
}) => {
	const statusesMappingSchema = useMemo(
		() =>
			z.object(
				weekStatuses.reduce((acc: Record<string, z.ZodString>, status) => {
					acc[status.id] = z.string({ required_error: "Выберите статус" });
					return acc;
				}, {}),
			),
		[weekStatuses],
	);

	const form = useForm<z.infer<typeof statusesMappingSchema>>({
		resolver: zodResolver(statusesMappingSchema),
	});

	const statusesMap = useAppStore((state) => state.statusesMap);
	const resetStatusesMap = useAppStore((state) => state.resetTaskStatusesMap);
	useEffect(() => {
		if (statusesMap) {
			const result = statusesMappingSchema.safeParse(statusesMap);
			if (result.success) {
				form.reset(result.data);
			} else {
				resetStatusesMap();
			}
		}
	}, [statusesMap, form.reset, statusesMappingSchema, resetStatusesMap]);

	const setTaskStatusesMap = useAppStore((state) => state.setTaskStatusesMap);

	const tableRows = weekStatuses.map((status) => (
		<TableRow key={status.id}>
			<TableCell>{status.name}</TableCell>
			<TableCell>
				<FormField
					control={form.control}
					name={status.id}
					render={({ field: { onChange, value } }) => (
						<FormItem>
							<FormControl>
								<Select value={value} onValueChange={onChange}>
									<SelectTrigger className="max-w-[300px]">
										<SelectValue placeholder="Выберите статус в Jira" />
									</SelectTrigger>
									<SelectContent>
										{jiraStatuses.map((status) => (
											<SelectItem key={status.id} value={status.id}>
												{status.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</TableCell>
		</TableRow>
	));

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(setTaskStatusesMap)}
				className="space-y-[10px]"
			>
				<Table className="border">
					<TableHeader>
						<TableRow>
							<TableHead>Колонка в Weeek</TableHead>
							<TableHead>Статус в Jira</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>{tableRows}</TableBody>
				</Table>
				<Button type="submit" variant="outline">
					Подтвердить выбор
				</Button>
			</form>
		</Form>
	);
};
