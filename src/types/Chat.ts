import { Message } from './Message';
import Team from './Team';

export interface ChatUser {
  id: number;
  nickname: string;
  user_avatar: string;
}

export interface Chat {
  team: Team;
  roomId: string;
  messages: Message[];
  members: ChatUser[];
}
