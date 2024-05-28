import { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { answerTeamRequest } from '../api/teamRequsts.ts/answerTeamRequest';
import { useTeamRequests } from '../hooks/useTeamRequests';
import { useRequestEvents } from '../hooks/useRequestEvents';
import cancelIcon from '../assets/images/cancel-invite.png';
import { cancelFriendRequest } from '../api/friendsRequests/cancelFriendRequest';
const RequestsList = () => {
  const { receivedRequests, sentRequests, requestsToTeam, id } = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const isActive = useSelector((state: RootState) => state.modalReducer.requestsIsActive);
  const [teamRequestsFromPlayers, teamRequestsFromTeam] = useTeamRequests(requestsToTeam, id);
  const myTeamReqsSent = teamRequestsFromPlayers.filter((req) => req.toUserId === id);
  const myTeamReqsReceived = teamRequestsFromTeam.filter((req) => req.toUserId === id);

  const dispatch = useAppDispatch();
  const [reqCategory, setReqCategory] = useState<'players' | 'teams'>('players');
  const [reqsType, setReqsType] = useState<'incoming' | 'outgoing'>('incoming');

  const navigate = useNavigate();

  useRequestEvents(id);
  useEffect(() => {
    return () => {
      dispatch(changeReqsState(false));
    };
  }, []);

  useEffect(() => {
    if (receivedRequests.length + sentRequests.length + requestsToTeam.length === 0) {
      dispatch(changeReqsState(false));
    }
  }, [receivedRequests, sentRequests, requestsToTeam]);

  return receivedRequests.length > 0 || sentRequests.length > 0 || requestsToTeam.length > 0 ? (
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
            <ReqsHeaderContainer>
              <ReqsHeader
                onClick={() => {
                  if (reqsType !== 'incoming') setReqsType('incoming');
                }}
                data-reqs={receivedRequests.length + myTeamReqsReceived.length}
                $teamsReqs={receivedRequests.length + myTeamReqsReceived.length}
                $selected={reqsType === 'incoming'}
              >
                Входящие заявки
              </ReqsHeader>
              <ReqsHeader
                onClick={() => {
                  if (reqsType !== 'outgoing') setReqsType('outgoing');
                }}
                $selected={reqsType === 'outgoing'}
                data-reqs={myTeamReqsSent.length + sentRequests.length}
                $teamsReqs={myTeamReqsSent.length + sentRequests.length}
              >
                Мои заявки
              </ReqsHeader>
            </ReqsHeaderContainer>

            <ReqsType>
              <ReqName
                onClick={() => {
                  if (reqCategory !== 'players') setReqCategory('players');
                }}
                data-reqs={reqsType === 'incoming' ? receivedRequests.length : sentRequests.length}
                $friendsReqs={reqsType === 'incoming' ? receivedRequests.length : sentRequests.length}
                $selected={reqCategory === 'players'}
              >
                В друзья
              </ReqName>
              <ReqName
                onClick={() => {
                  if (reqCategory !== 'teams') setReqCategory('teams');
                }}
                $selected={reqCategory === 'teams'}
                $teamsReqs={reqsType === 'incoming' ? myTeamReqsReceived.length : myTeamReqsSent.length}
                data-reqs={reqsType === 'incoming' ? myTeamReqsReceived.length : myTeamReqsSent.length}
              >
                В команду
              </ReqName>
            </ReqsType>
            <ReqsList>
              {reqsType === 'incoming' ? (
                reqCategory === 'players' ? (
                  receivedRequests.length > 0 ? (
                    receivedRequests.map((req) => (
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
                    ))
                  ) : (
                    <ZeroReqsHeader>Нет входящих заявок в друзья</ZeroReqsHeader>
                  )
                ) : teamRequestsFromTeam.length > 0 ? (
                  teamRequestsFromTeam.map((req) => (
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
                  ))
                ) : (
                  <ZeroReqsHeader>Нет входящих заявок в команду</ZeroReqsHeader>
                )
              ) : reqCategory === 'players' ? (
                sentRequests.length > 0 ? (
                  sentRequests.map((req) => (
                    <ReqItem
                      key={req.id}
                      onClick={() => {
                        navigate(`/profile/${req.toUser.nickname}`);
                        dispatch(changeReqsState(false));
                      }}
                    >
                      <img src={req.toUser.user_avatar ? req.toUser.user_avatar : defaultUserIcon} alt='' />
                      <span>{req.toUser.nickname}</span>

                      <CommonButton
                        onClick={(e) => {
                          e.stopPropagation();

                          cancelFriendRequest(req?.id as number);
                        }}
                      >
                        <img src={cancelIcon} alt='' />
                        Отменить
                      </CommonButton>
                    </ReqItem>
                  ))
                ) : (
                  <ZeroReqsHeader>Нет отправленных заявок в друзья</ZeroReqsHeader>
                )
              ) : myTeamReqsSent.length > 0 ? (
                myTeamReqsSent.map((req) => (
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
                ))
              ) : (
                <ZeroReqsHeader>Нет входящих заявок в команду</ZeroReqsHeader>
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
            data-reqs={receivedRequests.length + myTeamReqsReceived.length}
            $requests={receivedRequests.length + myTeamReqsReceived.length}
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
  width: 450px;
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

const ReqsHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  column-gap: 20px;
  justify-content: center;
  align-items: center;
`;

const ReqsHeader = styled.h3<{ $selected: boolean; $friendsReqs?: number; $teamsReqs?: number }>`
  position: relative;

  color: var(--main-text-color);
  text-align: center;
  opacity: ${(p) => (p.$selected ? '1' : '0.5')};
  &:hover {
    opacity: 1;
    cursor: pointer;
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
    font-weight: 400;
    font-size: 14px;
    position: absolute;
    display: block;
    text-align: center;
    border-radius: 50%;
    background-color: #cf2b2b;
    width: 16px;
    height: 16px;
    color: #fff;
    right: -4px;
    top: -4px;
    pointer-events: none;
    z-index: 1;
  }
`;
const ReqsType = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #fff;
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

const ZeroReqsHeader = styled.h3`
  color: var(--main-text-color);
  text-align: center;
  margin-top: 20%;
`;

export default RequestsList;
