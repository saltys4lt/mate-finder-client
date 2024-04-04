import { Message } from './Message';

export interface ChatUser {
  id: number;
  nickname: string;
  user_avatar: string;
}

export interface Chat {
  team: boolean;
  roomId: string;
  messages: Message[];
  members: ChatUser[];
}
