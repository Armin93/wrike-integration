 export interface WrikeTask {
    id: string;
    title: string;
    responsibleIds?: string[];
    importance: string;
    parentIds?: string[];
    createdDate: string;
    updatedDate: string;
    permalink: string;
}

 export interface MappedTask {
    id: string;
    name: string;
    assignees: string[];
    status: string;
    collections: string[];
    created_at: string;
    updated_at: string;
    ticket_url: string;
}
