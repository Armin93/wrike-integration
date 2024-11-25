import dotenv from 'dotenv';
dotenv.config();

import { fetchFolders, fetchTasksForFolder } from "./requests";
import { fetchAllUserDetails, mapTasksWithUserDetails, writeFile} from "./helpers";

const main = async () => {
    try {
        const folders = await fetchFolders();
        const tasksByFolder = await Promise.all(
            folders.map(async folder => ({
                folderId: folder.id,
                tasks: await fetchTasksForFolder(folder.id),
            }))
        );

        const responsibleIdsSet = new Set<string>(
            tasksByFolder.flatMap(({ tasks }) =>
                tasks.flatMap(task =>
                    Array.isArray(task.responsibleIds) ? task.responsibleIds : [task.responsibleIds]
                )
            )
        );

        const userMap = await fetchAllUserDetails(responsibleIdsSet);
        const foldersWithMappedTasks = tasksByFolder.map(({ folderId, tasks }) => ({
            id: folderId,
            tasks: mapTasksWithUserDetails(tasks, userMap),
        }));

        await writeFile('folders.json', foldersWithMappedTasks);
    } catch (error) {
        console.error('Error in main execution:', error);
    }
};

main();
