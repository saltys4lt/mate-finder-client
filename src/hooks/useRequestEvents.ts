import { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux';
import { ioSocket } from '../api/webSockets/socket';
import {
  addTeamRequest,
  cancelTeamRequest,
  deleteFriend,
  joinTeam,
  leaveTeam,
  removeFriendRequest,
  removeTeamRequest,
  setUserFriends,
  setUserReceivedFriendRequests,
  setUserSentFriendRequests,
} from '../redux/userSlice';
import { Membership } from '../types/Membership';
import Team from '../types/Team';
import { TeamRequest } from '../types/TeamRequest';
import { FriendRequest } from '../types/friendRequest';
import { joinTeamChat, leaveTeamChat } from '../redux/chatSlice';
import { Chat } from '../types/Chat';
import Swal from 'sweetalert2';

export const useRequestEvents = (id: number) => {
  const dispatch = useAppDispatch();
  const [serverReloaded, setIsServerReloaded] = useState<boolean>(true);
  const setupEvents = () => {
    ioSocket.removeListener('friendRequest');
    ioSocket.removeListener('friendRequestAction');
    ioSocket.removeListener('friendRequestToUser');
    ioSocket.removeListener('friendRequestActionToUser');
    ioSocket.removeListener('teamRequest');
    ioSocket.removeListener('leaveTeam');
    ioSocket.removeListener('answerTeamRequest');
    ioSocket.removeListener('cancelTeamRequest');
    ioSocket.removeListener('cancelFriendRequest');

    ioSocket.on('connection', () => {
      setIsServerReloaded(true);
    });

    ioSocket.emit('connected', id);

    ioSocket.on('friendRequest', (req: FriendRequest) => {
      dispatch(setUserSentFriendRequests({ req, denied: -1 }));
    });
    ioSocket.on('friendRequestAction', ({ req, friend }) => {
      if (req.toUserId === id) {
        if (friend) {
          console.log(friend);
          dispatch(setUserFriends(friend));
        } else {
          dispatch(setUserReceivedFriendRequests({ req: req, denied: 1 }));
        }
      }
      return;
    });
    ioSocket.on('friendRequestToUser', (req: FriendRequest) => {
      if (req.toUserId === id) {
        dispatch(setUserReceivedFriendRequests({ req: req, denied: -1 }));
      }
      return;
    });
    ioSocket.on('friendRequestActionToUser', ({ req, friend }) => {
      if (req.fromUserId === id) {
        if (friend) {
          console.log(friend);

          dispatch(setUserFriends(friend));
        } else {
          dispatch(setUserSentFriendRequests({ req: req, denied: 1 }));
        }
      }
      return;
    });

    ioSocket.on('deleteFromFriends', (id: number) => {
      dispatch(deleteFriend(id));
    });

    ioSocket.on('cancelFriendRequest', (req: FriendRequest) => {
      if (req.fromUserId === id) {
        dispatch(removeFriendRequest({ req, denied: 0 }));
      } else {
        dispatch(removeFriendRequest({ req, denied: 1 }));
      }
    });
    ioSocket.on('teamRequest', (teamReq: TeamRequest) => {
      dispatch(addTeamRequest(teamReq));
    });
    ioSocket.on('leaveTeam', ({ team, userId, byOwner }: { team: Team; userId: number; byOwner: boolean }) => {
      dispatch(leaveTeam({ team, userId, byOwner }));
      if (userId === id) {
        dispatch(leaveTeamChat(team.chat?.id as number));
      }
    });
    ioSocket.on('answerTeamRequest', (request: { req: TeamRequest | Membership; accept: boolean; unvalid?: boolean }) => {
      if (request.unvalid) {
        console.log('123');
        dispatch(removeTeamRequest(request.req as TeamRequest));
        Swal.fire({
          icon: 'info',
          title: 'Запрос не действителен',
          text: 'Похоже кто-то другой уже принял заявку на эту роль 😢',
          timerProgressBar: true,
          timer: 5000,
          confirmButtonText: 'Понятно',
        });
      }

      if (request.accept) {
        const acceptedReq = request.req as Membership;
        dispatch(joinTeam(acceptedReq));

        if (request.req.user?.id === id) {
          const chat = acceptedReq.team?.chat as Chat;

          dispatch(joinTeamChat({ chat }));
        } else {
          const chat = acceptedReq.team?.chat as Chat;

          dispatch(joinTeamChat({ chat, member: request.req.user }));
        }
      } else {
        const deniedReq = request.req as TeamRequest;

        dispatch(removeTeamRequest(deniedReq));
      }
    });
    ioSocket.on('cancelTeamRequest', (req: TeamRequest) => {
      if (req.team?.userId === id) {
        dispatch(cancelTeamRequest({ req, toMyTeam: true }));
      } else {
        dispatch(cancelTeamRequest({ req, toMyTeam: false }));
      }
    });
  };

  useEffect(() => {
    if (serverReloaded) {
      setupEvents();
      setIsServerReloaded(false);
    }
  }, [id, serverReloaded]);
};
