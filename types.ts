export interface Task {
    id: string;
    title: string;
    responsibleIds: string[];
    parentIds: string[];
    createdDate: string;
    updatedDate: string;
    importance: string;
    permalink: string;
}

export interface MappedTask {
    id: string;
    name: string;
    assignees: {
        id: string;
        firstName: string;
        lastName: string;
        companyName: string;
        email: string;
    }[];
    status: string;
    collections: string[];
    created_at: string;
    updated_at: string;
    ticket_url: string;
}

export interface Folder {
    id: string;
    title: string;
    parentId?: string;
    childIds?: string[];
    createdDate: string;
    updatedDate?: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    primaryEmail: string;
    companyName?: string;
}
