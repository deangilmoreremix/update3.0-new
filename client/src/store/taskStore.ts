import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  contactId?: string;
  dealId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Record<string, Task>;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  // API methods
  fetchTasks: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  updateTaskApi: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTaskApi: (id: string) => Promise<void>;
}

// Mock task data for development
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with TechCorp',
    description: 'Schedule demo of new features',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-25',
    contactId: '1',
    dealId: '1',
    assignedTo: 'current_user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Prepare proposal for Innovate AI',
    description: 'Create custom proposal with pricing',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-01-30',
    contactId: '2',
    dealId: '2',
    assignedTo: 'current_user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Send contract to Global Tech',
    description: 'Final contract review and execution',
    priority: 'high',
    status: 'completed',
    contactId: '3',
    dealId: '3',
    assignedTo: 'current_user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: mockTasks.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {} as Record<string, Task>),

  addTask: (task) =>
    set((state) => ({
      tasks: { ...state.tasks, [task.id]: task },
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [id]: { ...state.tasks[id], ...updates, updatedAt: new Date().toISOString() },
      },
    })),

  deleteTask: (id) =>
    set((state) => {
      const newTasks = { ...state.tasks };
      delete newTasks[id];
      return { tasks: newTasks };
    }),

  getTask: (id) => get().tasks[id],

  // API methods
  fetchTasks: async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasksArray = await response.json();
      
      const tasks = tasksArray.reduce((acc: Record<string, Task>, task: Task) => {
        acc[task.id] = task;
        return acc;
      }, {});
      
      set({ tasks });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Fallback to mock data if API fails
      const fallbackTasks = mockTasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {} as Record<string, Task>);
      
      set({ tasks: fallbackTasks });
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const newTask = await response.json();
      get().addTask(newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTaskApi: async (id, updates) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const updatedTask = await response.json();
      get().updateTask(id, updatedTask);
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTaskApi: async (id) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      get().deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
}));