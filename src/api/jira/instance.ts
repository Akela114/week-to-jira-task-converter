import axios from "axios";

export const jiraAPIInstance = axios.create({
  baseURL: "https://golart1.atlassian.net/rest/api/2",
  headers: {
    Authorization: `Basic ${Buffer.from(`${import.meta.env.VITE_JIRA_EMAIL}:${import.meta.env.VITE_JIRA_API_TOKEN}`).toString("base64")}`
  }
});