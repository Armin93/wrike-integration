import {Task, User} from "./types";
import fs from 'fs';

type NodeCallback<T> = (err: NodeJS.ErrnoException | null, result?: T) => void;

const promisify = <T, A>(fn: (args: T, cb: NodeCallback<A>) => void): ((args: T) => Promise<A>) =>
    (args: T) =>
        new Promise((resolve, reject) => {
            fn(args, (err, result) => {
                if (err) reject(err);
                else resolve(result as A);
            });
        });

const writeFileAsync = promisify<{
    path: fs.PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options?: fs.WriteFileOptions
}, void>((args, callback) => {
    const { path, data, options = {} } = args;
    fs.writeFile(path, data, options, callback);
});

export const writeFile = async (filePath: string, data: unknown): Promise<void> => {
    try {
        const formattedData = JSON.stringify(data, null, 2);
        await writeFileAsync({ path: filePath, data: formattedData, options: { encoding: 'utf8' } });
        console.log(`File written successfully to ${filePath}`);
    } catch (err) {
        console.error(`Error writing file to ${filePath}:`, err);
    }
};


export const mapTasksWithUserDetails = (
    tasks: Task[],
    userMap: User | User[] | null
): {
    updated_at: string;
    collections: string[];
    name: string;
    assignees: {
        firstName: string;
        lastName: string;
        companyName: string | undefined;
        id: string;
        email: string;
    }[];
    created_at: string;
    id: string;
    ticket_url: string;
    status: string;
}[] => {
    const normalizedUserMap = Array.isArray(userMap) ? userMap : userMap ? [userMap] : [];

    return tasks.map((task) => {
        const assignees = Array.isArray(task.responsibleIds) ? task.responsibleIds : [task.responsibleIds];

        const assigneeDetails = normalizedUserMap
            .filter(user => assignees.includes(user.id))
            .map(user => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                companyName: user.companyName,
                email: user.primaryEmail,
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
