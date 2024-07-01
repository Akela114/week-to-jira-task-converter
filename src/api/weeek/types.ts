type TWeekAPIResponse<T extends Record<string, unknown>> = {
  success: false;
  message: string;
} | ({
  success: true;
} & T);

type ProjectCustomField = {
  id: string;
  name?: string;
  type: string;
  config?: {
    type: string;
  };
  options: {
    id: string;
    name: string;
    color: string;
  }[];
}

type Project = {
  id: number;
  title: string;
  logoLink?: string;
  description?: string;
  color: string;
  isPrivate: boolean;
  team: string[];
  customFields: ProjectCustomField[];
}

type Board = {
  id: number;
  name: string;
  projectId: number;
  isPrivate: boolean;
}

type BoardColumn = {
  id: number;
  name: string;
  boardId: number;
}


type WorkLoad = {
  id: string;
  userId: string;
  type: 1 | 2;
  date: string;
  duration: number;
  workStartAt?: string;
  workEndAt?: string;
}

type TimeEntry = {
  id: string;
  userId: string;
  type: 1 | 2;
  isOvertime?: boolean;
  date: `${number}-${number}-${number}`;
  duration: number;
}

type Attachment = {
  id: string;
  creatorId: string;
  service: "week" | "google_drive" | "dropbox" | "one_drive" | "box";
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export type Task = {
  id: number;
  parentId?: number;
  title: string;
  description?: string;
  duration?: number;
  type: "action" | "meet" | "call";
  priority: 0 | 1 | 2 | 3;
  isCompleted: boolean;
  authorId: string;
  userId?: string;
  boardId: number;
  boardColumnId: number;
  projectId: number;
  image?: string;
  isPrivate: boolean;
  startDate?: `${number}-${number}-${number}`;
  startDateTime?: string;
  dueDate?: `${number}-${number}-${number}`;
  dueDateTime?: string;
  createdAt?: string;
  updatedAt?: string;
  tags: number[];
  subscribers: string[];
  subTasks: number[];
  workloads: WorkLoad[];
  timeEntries: TimeEntry[];
  customFields: unknown;
  attachments: Attachment[];
}

type Member = {
  id: string;
  email: string;
  logo?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  position?: string;
  timeZone: string;
}

export type GetProjectsListData = TWeekAPIResponse<{ projects: Project[]; }>
export type GetBoardListData = TWeekAPIResponse<{ boards: Board[]; }>
export type GetBoardColumnListData = TWeekAPIResponse<{ boardColumns: BoardColumn[]; }>
export type GetBoardColumnTaskList = TWeekAPIResponse<{ tasks: Task[]; hasMore: boolean; }>
export type GetBoardTask = TWeekAPIResponse<{ task: Task; }>
export type GetWorkspaceMembers = TWeekAPIResponse<{ members: Member[]; }>