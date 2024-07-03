//projects
export interface JiraProject {
	avatarUrls: AvatarUrls
	id: string
	insight: Insight
	key: string
	name: string
	projectCategory: ProjectCategory
	self: string
	simplified: boolean
	style: string
  }
  
interface AvatarUrls {
  "16x16": string
  "24x24": string
  "32x32": string
  "48x48": string
}
  
interface Insight {
  lastIssueUpdateTime: number
	totalIssueCount: number
  }
  
interface ProjectCategory {
	description: string
	id: string
	name: string
	self: string
}

export interface ProjectCreate {
	name: string;
	key: string;
	leadAccountId: string;
	projectTypeKey: "software" | "service_desk" | "business";
}
  
//users______________________________________________

export interface User {
	accountId: string
	accountType: string
	active: boolean
	avatarUrls: AvatarUrls
	displayName: string
	key: string
	name: string
	self: string
}

// statuses______________________________________________

export interface StatusRoot {
  id: string
  name: string
  self: string
  statuses: Status[]
  subtask: boolean
}

export interface Status {
  description: string
  iconUrl: string
  id: string
  name: string
  self: string
}

// tasks______________________________________________
export interface CreateTaskBody {
	fields: Fields;
  update?: Update[]
  historyMetadata?: HistoryMetadata
  properties?: Property[]
  transition?: TransitionCreate
}

export interface Fields {
  assignee?: {
    id?: string;
  };
  components?: objectId[];
  customfield_10000?: string;
  description: string;
  duedate?: string;
  environment?: string;
  fixVersions?: objectId[];
  issuetype: objectId;
  labels?: string[];
  parent?: objectId;
  priority?: objectId;
  project: objectId;
  reporter?: objectId;
  security?: objectId;
  summary: string
  timetracking?: {
		originalEstimate: string;
		remainingEstimate: string;
	};
  versions?: objectId[];
}

interface objectId {
	id: string;
}

interface Update {
  add: unknown;
  copy: unknown;
  edit: unknown;
  remove: unknown;
  set: unknown;
}

interface HistoryMetadata {
  activityDescription: string;
  activityDescriptionKey: string;
  actor: UserForTask;
  cause: UserForTask;
  description: string;
  descriptionKey: string;
  emailDescription: string;
  emailDescriptionKey: string;
  generator: Generator;
}

interface UserForTask {
  avatarUrl: string;
  displayName: string;
  displayNameKey: string;
  id: string;
  type: string;
  url: string;
}

interface Property {
  key: string;
  value: string;
}

interface TransitionCreate {
  id: string;
  looped: boolean;
}

export interface CreateBodyResponse {
  id: string;
  key: string;
  self: string;
}

export interface TransitionForTasks {
  expend: string;
  transitions: Transition[]
}

export interface Transition {
  fields: FieldsFotTransition;
  hasScreen: boolean;
  id: string;
  isAvailable?: boolean;
  isConditional?: boolean;
  isGlobal?: boolean;
  isInitial?: boolean;
  name: string;
  to: To
}

export interface FieldsFotTransition {
  summary: Summary
  colour?: Colour
}

export interface Summary {
  allowedValues: string[]
  defaultValue: string
  hasDefaultValue: boolean
  key: string
  name: string
  operations: string[]
  required: boolean
  schema: Schema
}

export interface Schema {
  custom: string
  customId: number
  items: string
  type: string
}

export interface Colour {
  allowedValues: string[]
  defaultValue: string
  hasDefaultValue: boolean
  key: string
  name: string
  operations: string[]
  required: boolean
  schema: Schema2
}

export interface Schema2 {
  custom: string
  customId: number
  items: string
  type: string
}

export interface To {
  description: string
  iconUrl: string
  id: string
  name: string
  self: string
  statusCategory: StatusCategory
}

export interface StatusCategory {
  colorName: string
  id: number
  key: string
  name?: string
  self: string
}

export type GetProjectRolesResponse = Record<string, string>;

export type GetProjectDetailsResponse = {
  actors: {
    displayName: string;
    id: number;
    name: string;
    type: string;
    actorUser?: {
      accountId: string;
    }
  }[];
}

export interface JiraGetPriority {
  description: string
  iconUrl: string
  id: string
  name: string
  self: string
  statusColor: string
}

export interface JiraProjectMeta {
  fields: Field[]
  maxResults: number
  startAt: number
  total: number
}

interface Field {
  fieldId: string
  hasDefaultValue: boolean
  key: string
  name: string
  operations: string[]
  required: boolean
}