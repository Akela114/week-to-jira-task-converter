import axios from "axios";

export const jiraAPIInstance = axios.create({
  baseURL: "/jira-api",
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_JIRA_API_TOKEN}`,
  }
});