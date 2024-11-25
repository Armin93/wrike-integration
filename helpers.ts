import fs from 'fs';
import util from 'util';
import {Task, User} from "./types";
import {fetchUserDetails} from "./requests";

const writeFileAsync = util.promisify(fs.writeFile);

export const writeFile = async (filePath: string, data: unknown): Promise<void> => {
    try {
        const formattedData = JSON.stringify(data, null, 2);
        await writeFileAsync(filePath, formattedData);
        console.log(`File written successfully to ${filePath}`);
    } catch (err) {
        console.error(`Error writing file to ${filePath}:`, err);
    }
};

export const fetchAllUserDetails = async (userIds: Set<string>): Promise<Map<string, User>> => {
    const userDetails = await Promise.all(Array.from(userIds).map(fetchUserDetails));
    return userDetails.flat().reduce((map, user) => {
        if (user?.id) map.set(user.id, user);
        return map;
    }, new Map<string, User>());
};

export const mapTasksWithUserDetails = (tasks: Task[], userMap: Map<string, User>): { updated_at: string; collections: string[]; name: string; assignees: { firstName: string; lastName: string; companyName: string | undefined; id: string; email: string }[]; created_at: string; id: string; ticket_url: string; status: string }[] => {
    return tasks.map((task) => {
        const assignees = Array.isArray(task.responsibleIds) ? task.responsibleIds : [task.responsibleIds];
        const assigneeDetails = assignees
            .map(id => userMap.get(id))
            .filter(Boolean)
            .map(user => ({
                id: user!.id,
                firstName: user!.firstName,
                lastName: user!.lastName,
                companyName: user!.companyName,
                email: user!.primaryEmail,
            }));

        return {
            id: task.id,
            name: task.title,
            assignees: assigneeDetails,
            status: task.importance,
            collections: task.parentIds ?? [],
            created_at: task.createdDate,
            updated_at: task.updatedDate,
            ticket_url: task.permalink,
        };
    });
};
