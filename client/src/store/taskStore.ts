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
}));