import ClientUser from './ClientUser';
import { FriendRequest } from './friendRequest';

export interface UserFriendsData {
  friends: ClientUser[];
  sentRequests: FriendRequest[];
  receivedRequests: FriendRequest[];
}
