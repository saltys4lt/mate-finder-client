export interface Message {
  id?: number;
  nickname: string;
  roomId: string;
  text: string;
  time: Date;
  checked: boolean;
}
