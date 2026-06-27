export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface MessageFormData {
  name: string;
  email: string;
  message: string;
}
