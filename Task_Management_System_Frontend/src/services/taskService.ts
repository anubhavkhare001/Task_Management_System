import axios from 'axios';

export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  remarks: string;
  createdOn?: string;
  lastUpdatedOn?: string;
}

const API_URL = '/api/tasks';

export const getAllTasks = async (): Promise<Task[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getTaskById = async (taskId: number): Promise<Task> => {
  const response = await axios.get(`${API_URL}/${taskId}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

export const updateTask = async (taskId: number, task: Task): Promise<Task> => {
  const response = await axios.put(`${API_URL}/${taskId}`, task);
  return response.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${taskId}`);
};

export const searchTasks = async (keyword: string): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { keyword },
  });
  return response.data;
};

export const getTasksByStatus = async (status: string): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/status/${status}`);
  return response.data;
};