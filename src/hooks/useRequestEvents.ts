import { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux';
import { ioSocket } from '../api/webSockets/socket';
import {
  addTeamRequest,
  cancelTeamRequest,
  joinTeam,
  leaveTeam,
  removeTeamRequest,
  setUserFriends,
  setUserReceivedFriendRequests,
  setUserSentFriendRequests,
} from '../redux/userSlice';
import { Membership } from '../types/Membership';
import Team from '../types/Team';
import { TeamRequest } from '../types/TeamRequest';
import { FriendRequest } from '../types/friendRequest';

export const useRequestEvents = (id: number) => {
  const dispatch = useAppDispatch();
  const [serverReloaded, setIsServerReloaded] = useState<boolean>(true);
  const setupEvents = () => {
    ioSocket.on('connection', () => {
      ioSocket.off('friendRequest');
      ioSocket.off('friendRequestAction');
      ioSocket.off('friendRequestToUser');
      ioSocket.off('friendRequestActionToUser');
      ioSocket.off('teamRequest');
      ioSocket.off('leaveTeam');
      ioSocket.off('answerTeamRequest');
      ioSocket.off('cancelTeamRequest');
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
    ioSocket.on('teamRequest', (teamReq: TeamRequest) => {
      dispatch(addTeamRequest(teamReq));
    });
    ioSocket.on('leaveTeam', ({ team, userId, byOwner }: { team: Team; userId: number; byOwner: boolean }) => {
      dispatch(leaveTeam({ team, userId, byOwner }));
    });
    ioSocket.on('answerTeamRequest', (request: { req: TeamRequest | Membership; accept: boolean }) => {
      if (request.accept) {
        const acceptedReq = request.req as Membership;
        dispatch(joinTeam(acceptedReq));
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
