import { AxiosInstance } from "axios";

// Define the base URL for the API
const API_URL = process.env.NEXT_PUBLIC_DELEGASI_API || "";

// Define the interface for the task response
export interface ITask {
  id: string;
  group_id: string;
  customer_id: string;
  description: string;
  due_date: string;
  completed_at: string | null;
  completed_by: string | null;
  status: string;
  customer_name: string;
  group_name: string;
}

// Function to fetch tasks from the API
export const getTasks = async (httpClient: AxiosInstance, groupId: string) => {
  return httpClient
    .get<ITask[]>(`${API_URL}/group/${groupId}/tasks`)
    .then((res) => res.data);
};

export interface IUpdateTaskRequestBody {
  status: string; //completed, uncompleted
}

// Function to update a task
export const updateTask = async (
  httpClient: AxiosInstance,
  groupId: string,
  taskId: string,
  body: IUpdateTaskRequestBody
) => {
  return httpClient
    .patch<ITask>(`${API_URL}/group/${groupId}/tasks/${taskId}`, body)
    .then((res) => res.data);
};
