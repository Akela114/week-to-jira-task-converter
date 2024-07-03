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
	weekPriority: {
		id: string;
		name?: string;
	}[];
	jiraPriority: {
		id: string;
		name?: string;
	}[];
};

export const PriorityMappingTable: FC<UsersMappingTableProps> = ({
	weekPriority,
	jiraPriority,
}) => {
	const statusesMappingSchema = useMemo(
		() =>
			z.object(
				weekPriority.reduce((acc: Record<string, z.ZodString>, priority) => {
					acc[priority.id] = z.string({ required_error: "Выберите приоритет" });
					return acc;
				}, {}),
			),
		[weekPriority],
	);

	const form = useForm<z.infer<typeof statusesMappingSchema>>({
		resolver: zodResolver(statusesMappingSchema),
	});

	const priorityMap = useAppStore((state) => state.priorityMap);
	const resetPriorityMap = useAppStore((state) => state.resetPriorityMap);
	useEffect(() => {
		if (priorityMap) {
			const result = statusesMappingSchema.safeParse(priorityMap);
			if (result.success) {
				form.reset(result.data);
			} else {
				resetPriorityMap();
			}
		}
	}, [priorityMap, form.reset, statusesMappingSchema, resetPriorityMap]);

	const setTaskStatusesMap = useAppStore((state) => state.setPriorityMap);

	const tableRows = weekPriority.map((status) => (
		<TableRow key={status.id}>
			<TableCell>{status.name}</TableCell>
			<TableCell>
				<FormField
					control={form.control}
					name={status.id}
					render={({ field: { onChange, value } }) => (
						<FormItem>
							<FormControl>
								<Select
									value={value}
									onValueChange={(e) => {
										onChange(e);
									}}
								>
									<SelectTrigger className="max-w-[300px]">
										<SelectValue placeholder="Выберите приоритет в Jira" />
									</SelectTrigger>
									<SelectContent>
										{jiraPriority.map((priority) => (
											<SelectItem key={priority.id} value={priority.id}>
												{priority.name}
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
							<TableHead>Приоритет в Weeek</TableHead>
							<TableHead>Приоритет в Jira</TableHead>
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
