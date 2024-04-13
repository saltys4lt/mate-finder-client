import React, { useState } from 'react';
import styled from 'styled-components';
import requestIcon from '../assets/images/friends.png';
import closeCross from '../assets/images/close-cross.png';

import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import ClientUser from '../types/ClientUser';
import { changeReqsState } from '../redux/modalSlice';
const RequestsList = () => {
  const { receivedRequests, sentRequests } = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const isActive = useSelector((state: RootState) => state.modalReducer.requestsIsActive);
  const dispatch = useAppDispatch();
  const [reqsType, setReqsType] = useState<'players' | 'teams'>('players');
  const [isMyReqsOpen, setIsMyReqsOpen] = useState<boolean>(false);

  return (
    receivedRequests.length > 0 && (
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
                >
                  Команды
                </ReqName>
              </ReqsType>
            </OpenRequests>
          </OpenRequestsContainer>
        ) : (
          <RequestsButtonContainer
            onClick={() => {
              dispatch(changeReqsState(true));
            }}
          >
            <RequestsButtonInnerContainer data-reqs={receivedRequests.length} $requests={receivedRequests.length}>
              <RequestsButton>
                <img src={requestIcon} alt='' />
              </RequestsButton>
            </RequestsButtonInnerContainer>
          </RequestsButtonContainer>
        )}
      </>
    )
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

export default RequestsList;
