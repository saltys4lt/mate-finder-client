import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState, useAppDispatch } from '../../redux';
import { changeChatState } from '../../redux/modalSlice';

const Chat = () => {
  const isActive = useSelector((state: RootState) => state.modalReducer.chatIsActive);
  const chats = useSelector((state: RootState) => state.chatReducer.chats);
  const currentChat = useSelector((state: RootState) => state.chatReducer.currentChat);

  const dispatch = useAppDispatch();

  const handleChangeChatState = (value: boolean) => {
    dispatch(changeChatState(value));
  };

  return !isActive ? (
    <ChatButtonContainer>
      <ChatButton onClick={() => handleChangeChatState(true)}>
        <img src='/images/chat.png' alt='' />
      </ChatButton>
    </ChatButtonContainer>
  ) : (
    <OpenChatContainer>
      <OpenChat>
        <CloseButton onClick={() => handleChangeChatState(false)}>
          <img src='/images/close-cross.png' alt='' />
        </CloseButton>
        <ChatList>
          {chats.length !== 0 ? (
            chats.map((chat) => (
              <div>
                {'nickname' in chat.partner ? (
                  <div>
                    <img src={chat.partner.user_avatar} alt='' /> <span>{chat.partner.nickname}</span>
                  </div>
                ) : (
                  <div>
                    <img src={chat.partner.avatar} alt='' /> <span>{chat.partner.name}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <>нету</>
          )}
        </ChatList>
        <CurrentChat>dsd</CurrentChat>
      </OpenChat>
    </OpenChatContainer>
  );
};

const ChatButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
`;

const ChatButton = styled.button`
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

const OpenChatContainer = styled.div`
  border-radius: 10px;
  padding: 10px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #434343;
  width: 500px;
  height: 300px;
  z-index: 10;
`;
const OpenChat = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    background-color: #434343;
  }
`;

const ChatList = styled.div`
  width: 30%;
`;

const CurrentChat = styled.div`
  width: 70%;
`;

export default Chat;
