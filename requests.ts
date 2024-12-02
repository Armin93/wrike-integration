import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";
import { Folder, Task, User } from "./types";
import dotenv from "dotenv";
import * as https from "https";
dotenv.config();

const { WRIKE_ACCESS_TOKEN, WRIKE_API_BASE_URL } = process.env;

if (!WRIKE_API_BASE_URL || !WRIKE_ACCESS_TOKEN) {
    throw new Error("Environment variables WRIKE_API_BASE_URL or WRIKE_ACCESS_TOKEN are missing.");
}

const httpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 10,
    timeout: 30000,
});


const axiosConfig: { headers: { Authorization: string }; baseURL: string ; httpsAgent: object} = {
    baseURL: WRIKE_API_BASE_URL.endsWith("/")
        ? WRIKE_API_BASE_URL
        : `${WRIKE_API_BASE_URL}/`,
    headers: {
        Authorization: `Bearer ${WRIKE_ACCESS_TOKEN}`,
    },
    httpsAgent
};

const apiClient: AxiosInstance = axios.create(axiosConfig);


const fetchData = async <T>(url: string, params?: Record<string, any>): Promise<T> => {
    const response = await apiClient.get(url, { params });
    return response.data.data;
};

export const fetchFolders = (): Promise<Folder[]> => fetchData<Folder[]>("/folders");

export const fetchTasksForFolder = (folderId: string): Promise<Task[]> =>
    fetchData<Task[]>(`/folders/${folderId}/tasks`, { fields: "[responsibleIds, parentIds]" });

export const fetchContacts = async (): Promise<User | null> => {
    try {
        return await fetchData('/contacts');
    } catch (error) {
        console.error(`Error fetching contacts: `, error);
        return null;
    }
};
