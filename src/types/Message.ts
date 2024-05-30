import ClientUser from './ClientUser.ts';

export interface Message {
  id?: number;
  roomId: string;
  text: string;
  userId: number;
  user?: ClientUser;
  time: Date;
  checked: CheckedBy[];
}

interface CheckedBy {
  id?: number;
  userId: number;
  user?: ClientUser;
  messageId?: number;
  message?: Message;
  isChecked: boolean;
}
