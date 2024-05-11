import { Message } from './Message';
import Team from './Team';

export interface ChatUser {
  id: number;
  nickname: string;
  user_avatar: string;
}

export interface Chat {
  id?: number;
  team?: Team;
  roomId: string;
  messages: Message[];
  members: ChatUser[];
}
