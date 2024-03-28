import { Message } from './Message';

import Team from './Team';

export interface ChatUser {
  id: number;
  nickname: string;
  avatar: string;
}

export interface Chat {
  id: string;
  messages: Message[];
  partner: ChatUser | Team;
}
