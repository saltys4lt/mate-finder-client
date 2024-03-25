import { Message } from './Message';
import Player from './Player';
import Team from './Team';

export interface Chat {
  id: string;
  messages: Message[];
  partner: Player | Team;
}
