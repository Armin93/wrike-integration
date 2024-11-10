import axios from 'axios';
import { promises as fs } from 'fs';
import { MappedTask, WrikeTask } from "./types";
import dotenv from 'dotenv';

dotenv.config();

const { WRIKE_ACCESS_TOKEN, WRIKE_API_URL } = process.env;

async function fetchAndMapTasks(): Promise<MappedTask[]> {
    try {
            const response = await axios.get<{ data: WrikeTask[] }>(WRIKE_API_URL!, {
                headers: {Authorization: `Bearer ${WRIKE_ACCESS_TOKEN}`},
                params: {
                    fields: '[responsibleIds]'
                },
            });

            const mappedTasks: MappedTask[] = response?.data.data.map(task => ({
                id: task.id,
                name: task.title,
                assignees: task.responsibleIds ?? [],
                status: task.importance,
                collections: task.parentIds ?? [],
                created_at: task.createdDate,
                updated_at: task.updatedDate,
                ticket_url: task.permalink,
            }));

            await saveTasksToFile(mappedTasks);
            return mappedTasks;
        }
    catch (error) {
        handleError(error);
        return [];
    }
}

async function saveTasksToFile(tasks: MappedTask[]): Promise<void> {
    try {
        await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
        console.log("Tasks have been saved to tasks.json");
    } catch (error) {
        console.error("Failed to save tasks to file:", error);
    }
}

function handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
        console.error(`Error fetching tasks: ${error.response?.status} - ${error.response?.statusText}`);
        if (error.response?.data) {
            console.error("Response data:", error.response.data);
        }
    } else {
        console.error(`An unexpected error occurred: ${error}`);
    }
}

fetchAndMapTasks();
