import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import requestIcon from '../assets/images/friends.png';
import closeCross from '../assets/images/close-cross.png';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import ClientUser from '../types/ClientUser';
import { changeReqsState } from '../redux/modalSlice';
import CommonButton from './UI/CommonButton';
import { friendRequestAnswer } from '../api/friendsRequests/friendRequestAnswer';
import defaultUserIcon from '../assets/images/default-avatar.png';
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
import { ioSocket } from '../api/webSockets/socket';
import { FriendRequest } from '../types/friendRequest';
import { useNavigate } from 'react-router-dom';
import { TeamRequest } from '../types/TeamRequest';
import { Membership } from '../types/Membership';
import { answerTeamRequest } from '../api/teamRequsts.ts/answerTeamRequest';
import { useTeamRequests } from '../hooks/useTeamRequests';
import Team from '../types/Team';
const RequestsList = () => {
  const { receivedRequests, sentRequests, requestsToTeam, id } = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const isActive = useSelector((state: RootState) => state.modalReducer.requestsIsActive);
  const [, teamRequestsFromTeam] = useTeamRequests(requestsToTeam, id);
  const dispatch = useAppDispatch();
  const [reqsType, setReqsType] = useState<'players' | 'teams'>('players');
  const navigate = useNavigate();
  useEffect(() => {
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

    return () => {
      dispatch(changeReqsState(false));
    };
  }, []);

  return receivedRequests.length > 0 || sentRequests.length > 0 || teamRequestsFromTeam.length > 0 ? (
    <>
      {isActive ? (
        <OpenRequestsContainer>
          <OpenRequests>
            <CloseButton
              onClick={() => {
                dispatch(changeReqsState(false));
              }}
            >
              <img src={closeCross} alt='' />
            </CloseButton>
            <ReqsHeader>Заявки</ReqsHeader>
            <ReqsType>
              <ReqName
                onClick={() => {
                  if (reqsType !== 'players') setReqsType('players');
                }}
                data-reqs={receivedRequests.length}
                $friendsReqs={receivedRequests.length}
                $selected={reqsType === 'players'}
              >
                Игроки
              </ReqName>
              <ReqName
                onClick={() => {
                  if (reqsType !== 'teams') setReqsType('teams');
                }}
                $selected={reqsType === 'teams'}
                $teamsReqs={requestsToTeam.length}
                data-reqs={requestsToTeam.length}
              >
                Команды
              </ReqName>
            </ReqsType>
            <ReqsList>
              {reqsType === 'players' ? (
                <>
                  {receivedRequests.map((req) => (
                    <ReqItem
                      key={req.id}
                      onClick={() => {
                        navigate(`/profile/${req.fromUser.nickname}`);
                        dispatch(changeReqsState(false));
                      }}
                    >
                      <img src={req.fromUser.user_avatar ? req.fromUser.user_avatar : defaultUserIcon} alt='' />
                      <span>{req.fromUser.nickname}</span>
                      <CommonButton
                        onClick={(e) => {
                          e.stopPropagation();
                          friendRequestAnswer({ accept: true, requestId: req.id as number });
                        }}
                      >
                        Принять
                      </CommonButton>
                      <CommonButton
                        onClick={(e) => {
                          e.stopPropagation();

                          friendRequestAnswer({ accept: false, requestId: req.id as number });
                        }}
                      >
                        Отклонить
                      </CommonButton>
                    </ReqItem>
                  ))}
                </>
              ) : (
                <>
                  {requestsToTeam.map((req) => (
                    <TeamReqItem
                      key={req.id}
                      onClick={() => {
                        navigate(`/team/${req.team?.name}`);
                      }}
                    >
                      <TeamReqItemData>
                        <div>
                          <img src={req.team?.avatar} alt='' />
                          <span>{req.team?.name}</span>
                        </div>
                        <span>
                          Приглашение на роль: <span>{req.role?.name}</span>
                        </span>
                      </TeamReqItemData>
                      <TeamActionButtons>
                        <CommonButton
                          onClick={(e) => {
                            e.stopPropagation();
                            answerTeamRequest({ accept: true, req: req });
                          }}
                        >
                          Принять
                        </CommonButton>
                        <CommonButton
                          onClick={(e) => {
                            e.stopPropagation();

                            answerTeamRequest({ accept: false, req: req });
                          }}
                        >
                          Отклонить
                        </CommonButton>
                      </TeamActionButtons>
                    </TeamReqItem>
                  ))}
                </>
              )}
            </ReqsList>
          </OpenRequests>
        </OpenRequestsContainer>
      ) : (
        <RequestsButtonContainer
          onClick={() => {
            dispatch(changeReqsState(true));
          }}
        >
          <RequestsButtonInnerContainer
            data-reqs={receivedRequests.length + requestsToTeam.length}
            $requests={receivedRequests.length + requestsToTeam.length}
          >
            <RequestsButton>
              <img src={requestIcon} alt='' />
            </RequestsButton>
          </RequestsButtonInnerContainer>
        </RequestsButtonContainer>
      )}
    </>
  ) : (
    <></>
  );
};

const RequestsButtonInnerContainer = styled.div<{ $requests: number }>`
  position: relative;
  display: block;

  &::before {
    content: ${(p) => (p.$requests != 0 ? 'attr(data-reqs)' : '')};
    position: absolute;
    display: block;
    text-align: center;
    border-radius: 50%;
    background-color: #cf2b2b;
    width: 20px;
    height: 20px;
    color: #fff;
    right: -2px;
    top: -2px;
    pointer-events: none;
    z-index: 1;
  }
`;

const RequestsButtonContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 1;
`;

const RequestsButton = styled.button`
  width: 60px;
  height: 60px;

  border-radius: 10px;
  border: 0;
  background-color: #333;

  &:hover {
    cursor: pointer;
    background-color: #434343;
  }
  img {
    filter: invert(1);
    width: 30px;
  }
`;

const OpenRequestsContainer = styled.div`
  border-radius: 10px;
  padding: 10px;
  position: fixed;
  bottom: 100px;
  right: 20px;
  background-color: #343434;
  width: 400px;
  height: 400px;
  z-index: 10;
`;
const OpenRequests = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 5px;
  top: 5px;
  border: 0;
  background-color: transparent;

  img {
    width: 20px;
    height: 20px;
    filter: invert(1);
  }
  &:hover {
    cursor: pointer;
  }
`;

const ReqsHeader = styled.h3`
  color: var(--main-text-color);
  text-align: center;
`;
const ReqsType = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #fff;
  margin-top: 15px;
`;
const ReqName = styled.span<{ $selected: boolean; $friendsReqs?: number; $teamsReqs?: number }>`
  position: relative;
  color: var(--main-text-color);
  text-align: center;
  font-size: 18px;
  width: 50%;
  border-radius: 3px 3px 0px 0px;
  background-color: ${(p) => (p.$selected ? '#565656' : 'transparent')};
  cursor: pointer;
  &:hover {
    background-color: #a3a3a3;
  }
  &::before {
    content: ${(p) => {
      if (p.$friendsReqs) {
        return p.$friendsReqs != 0 ? 'attr(data-reqs)' : '';
      }
      if (p.$teamsReqs) {
        return p.$teamsReqs != 0 ? 'attr(data-reqs)' : '';
      }
    }};
    font-size: 14px;
    position: absolute;
    display: block;
    text-align: center;
    border-radius: 50%;
    background-color: #cf2b2b;
    width: 18px;
    height: 18px;
    color: #fff;
    right: -2px;
    top: -2px;
    pointer-events: none;
    z-index: 1;
  }
`;

const ReqsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;

const ReqItem = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  > img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    border: 1px solid #111;
  }
  span {
    color: var(--main-text-color);
  }
  &:hover {
    background-color: #595959;
    cursor: pointer;
  }
`;

const TeamActionButtons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  row-gap: 5px;
`;

const TeamReqItem = styled.div`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;

  &:hover {
    background-color: #595959;
    cursor: pointer;
  }
`;
const TeamReqItemData = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  padding: 5px;
  width: 100%;
  > div {
    display: flex;
    align-items: center;
    column-gap: 5px;
    > img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 5px;
      border: 1px solid #111;
    }
    span {
      color: var(--main-text-color);
    }
  }
  span {
    color: var(--main-text-color);
    font-size: 14px;
    > span {
      font-size: 15px;

      font-weight: 700;
      color: #de3434;
    }
  }
`;

export default RequestsList;
