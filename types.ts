
export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  imageUrl?: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface User {
  username: string;
  email: string;
  isLoggedIn: boolean;
}

export interface AppSettings {
  model: string;
  temperature: number;
  imageAspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
}
