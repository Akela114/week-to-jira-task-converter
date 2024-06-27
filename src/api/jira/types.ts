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
  
//users 

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