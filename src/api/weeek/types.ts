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

export type GetProjectsListData = {
  success: false;
  message: string;
} | {
  success: true;
  projects: Project[];
}

export type GetBoardListData = {
  success: false;
  message: string;
} | {
  success: true;
  boards: Board[];
}