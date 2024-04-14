import ClientUser from './ClientUser';

export interface FriendRequest {
  id?: number;
  fromUserId: number;
  toUserId: number;
  createdAt: Date;
  fromUser: ClientUser;
  toUser: ClientUser;
}

export interface FriendRequestWithAction {
  req: FriendRequest;
  denied: 0 | 1 | -1;
}
