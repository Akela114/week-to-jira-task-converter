import axios from "axios";

export const weeekAPIInstance = axios.create({
  baseURL: 'https://api.weeek.net/public/v1',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_WEEEK_API_KEY}`,
  }
});