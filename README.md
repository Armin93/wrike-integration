# Fetch and Map Wrike Tasks

This Node.js script fetches tasks from the Wrike API, maps them to a custom structure, and saves the mapped tasks to a `tasks.json` file. It includes error handling for API requests and file operations.

## Prerequisites

Before running this script, ensure you have:
- **Node.js** (version 16 or higher)
- **Yarn** (or npm)
- **Wrike API access** with a valid access token

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Armin93/wrike-integration.git
   cd wrike-integration
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

   or

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the project root and add your Wrike API access token and API URL:

   ```plaintext
   WRIKE_ACCESS_TOKEN=your_wrike_access_token
   WRIKE_API_URL=https://www.wrike.com/api/v4/tasks
   ```

## Script Overview

### `fetchAndMapTasks`

Fetches tasks from the Wrike API, maps them to a custom structure, and saves the results to a JSON file.

- **Returns**: A list of mapped tasks (`MappedTask[]`).
- **Mapping Fields**:
    - `id`: Task ID
    - `name`: Task title
    - `assignees`: Array of user IDs assigned to the task
    - `status`: Importance or priority level of the task
    - `collections`: Parent IDs or collections containing the task
    - `created_at`: Task creation date
    - `updated_at`: Last update date for the task
    - `ticket_url`: Permalink URL to the task in Wrike

### `saveTasksToFile`

Saves the mapped tasks to a file named `tasks.json`.

- **Input**: An array of mapped tasks (`MappedTask[]`).
- **Output**: Saves the tasks to `tasks.json` in the project directory.

### `handleError`

Handles errors for the Axios request and file operations, logging specific information for troubleshooting.

- **Input**: Error object.
- **Output**: Logs the error details to the console.

## Usage

To run the script, use:

```bash
node index.js
```
or 
```bash
yarn start
```

Upon success, a `tasks.json` file will be created in the project directory containing the fetched tasks in the following format:

```json
[
  {
    "id": "task_id",
    "name": "Task Title",
    "assignees": ["user_id"],
    "status": "High",
    "collections": ["parent_id"],
    "created_at": "2024-11-10T00:00:00Z",
    "updated_at": "2024-11-10T12:00:00Z",
    "ticket_url": "https://www.wrike.com/open.htm?id=task_id"
  }
]
```

## Error Handling

If the script encounters an error, it logs the details:

- **API Errors**: Logs the response status and error data if available, helpful for debugging API request issues.
- **Other Errors**: Logs unexpected errors that occur outside the API request.
