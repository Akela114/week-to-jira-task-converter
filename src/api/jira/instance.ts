import axios from "axios";

export const jiraAPIInstance = axios.create({
  baseURL: "/jira-api",
  auth: {
    username: import.meta.env.VITE_JIRA_API_EMAIL,
    password: import.meta.env.VITE_JIRA_API_TOKEN,
  }
});