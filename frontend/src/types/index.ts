export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number; // in seconds
  participants: string[];
  audioUrl?: string;
  transcript: string;
  summary: string;
  tasks: Task[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  description: string;
  assignee: string;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface AudioFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  duration?: number;
  uploadedAt: string;
}

export interface ProcessingStatus {
  meetingId: string;
  status: 'uploading' | 'transcribing' | 'summarizing' | 'completed' | 'error';
  progress: number; // 0-100
  message?: string;
  estimatedTimeRemaining?: number; // in seconds
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}