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
import type { FC } from "react";
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
import { useWeeekStore } from "@/store/weeek-store";

type UsersMappingTableProps = {
	weekUsers: {
		id: string;
		name?: string;
	}[];
	jiraUsers: {
		id: string;
		name?: string;
	}[];
};

export const UsersMappingTable: FC<UsersMappingTableProps> = ({
	weekUsers,
	jiraUsers,
}) => {
	const usersMappingSchema = z.object(
		weekUsers.reduce((acc: Record<string, z.ZodString>, user) => {
			acc[user.id] = z.string({ required_error: "Выберите пользователя" });
			return acc;
		}, {}),
	);

	const form = useForm<z.infer<typeof usersMappingSchema>>({
		resolver: zodResolver(usersMappingSchema),
	});

	const setUsersMap = useWeeekStore((state) => state.setUsersMap);

	const tableRows = weekUsers.map((user) => (
		<TableRow key={user.id}>
			<TableCell>{user.name}</TableCell>
			<TableCell>
				<FormField
					control={form.control}
					name={user.id}
					render={({ field: { onChange, value } }) => (
						<FormItem>
							<FormControl>
								<Select value={value} onValueChange={onChange}>
									<SelectTrigger className="max-w-[300px]">
										<SelectValue placeholder="Выберите пользователя в Weeek" />
									</SelectTrigger>
									<SelectContent>
										{jiraUsers.map((user) => (
											<SelectItem key={user.id} value={user.id}>
												{user.name}
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
			<form onSubmit={form.handleSubmit(setUsersMap)}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Пользователь в Weeek</TableHead>
							<TableHead>Пользователь в Jira</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>{tableRows}</TableBody>
				</Table>
				<Button type="submit" variant="outline">
					Подтвердить изменения
				</Button>
			</form>
		</Form>
	);
};
