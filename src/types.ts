export type Role = 'user' | 'assistant';

export interface MessageImage {
  url: string;
  base64?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  images?: MessageImage[];
  timestamp: number;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}
