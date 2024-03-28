import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState, useAppDispatch } from '../../redux';
import { changeChatState } from '../../redux/modalSlice';
import { ioSocket } from '../../api/webSockets/socket';

import CommonInput from '../UI/CommonInput';
import UserMessage from './UserMessage';
import PlayerMessage from './PlayerMessage';
import { Message } from '../../types/Message';

import { getChat, getMessage, setCurrentChat } from '../../redux/chatSlice';
import { ChatUser, Chat as IChat } from '../../types/Chat';

const Chat = () => {
  const isActive = useSelector((state: RootState) => state.modalReducer.chatIsActive);
  const chats = useSelector((state: RootState) => state.chatReducer.chats);
  const currentChat = useSelector((state: RootState) => state.chatReducer.currentChat);
  const user = useSelector((state: RootState) => state.userReducer.user);

  const [message, setMessage] = useState<string>('');

  const dispatch = useAppDispatch();
  const handleChangeChatState = (value: boolean) => {
    dispatch(changeChatState(value));
  };

  const handleSendMessage = () => {
    if (message) {
      const newMessage: Message = {
        chatId: currentChat?.id as string,
        nickname: user?.nickname as string,
        text: message,
        time: Date.now().toString(),
        userId: user?.id as number,
      };
      setMessage('');
      if (currentChat?.messages.length === 0) {
        ioSocket.emit('firstMessage', {
          chat: { ...currentChat, messages: [newMessage] },
          partner: {
            avatar: currentChat.partner.avatar,
            nickname: (currentChat.partner as ChatUser).nickname,
            id: (currentChat.partner as ChatUser).id,
          } as ChatUser,
        });
      } else ioSocket.emit('sendMessage', newMessage);
    }
  };

  useEffect(() => {
    ioSocket.on('connection', () => {});
    ioSocket.on('getMessage', (value: Message) => {
      dispatch(getMessage(value));
    });
    ioSocket.on('firstMessage', (value: { chat: IChat; playerId: number }) => {
      if (user?.id === value.playerId) {
        ioSocket.emit('join', value.chat.id);
        dispatch(getChat(value.chat));
      }
    });

    ioSocket.on('getChats', (value: IChat[]) => {});
    ioSocket.on('disconnect', () => {});

    return () => {
      ioSocket.removeAllListeners();
    };
  }, []);

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
              <ChatListItem key={chat.id} onClick={() => dispatch(setCurrentChat(chat))}>
                {'nickname' in chat.partner ? (
                  <>
                    <img src={chat.partner.avatar} alt='' /> <span>{chat.partner.nickname}</span>
                  </>
                ) : (
                  <>
                    <img src={chat.partner.avatar} alt='' /> <span>{chat.partner.name}</span>
                  </>
                )}
              </ChatListItem>
            ))
          ) : (
            <>нету</>
          )}
        </ChatList>

        <CurrentChat>
          {currentChat ? (
            'nickname' in currentChat.partner ? (
              <>
                <CurrentChatHeader>
                  <img src={currentChat.partner.avatar} alt='' /> <span>{currentChat.partner.nickname}</span>
                </CurrentChatHeader>
                <MessagesContainer>
                  {currentChat.messages.map((message) =>
                    message.userId === user?.id ? (
                      <UserMessage key={message.time} message={message}></UserMessage>
                    ) : (
                      <PlayerMessage key={message.time} message={message}></PlayerMessage>
                    ),
                  )}
                </MessagesContainer>
                <SendMessageContainer>
                  <CommonInput
                    style={{ borderRadius: '5px 0 0 5px' }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Ваше сообщение...'
                  />
                  <SendMessageButton
                    onClick={() => {
                      handleSendMessage();
                    }}
                  >
                    <img src='/images/message.png' alt='' />
                  </SendMessageButton>
                </SendMessageContainer>
              </>
            ) : (
              <CurrentChatHeader>
                <img src={currentChat.partner.avatar} alt='' /> <span>{currentChat.partner.name}</span>
              </CurrentChatHeader>
            )
          ) : (
            <>...</>
          )}
        </CurrentChat>
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
  width: 100%;
  height: 100%;
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
  width: 28%;
  height: 100%;
  border-right: 1px solid #fff;
`;

const ChatListItem = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  column-gap: 10px;

  img {
    width: 30px;
  }
  &:hover {
    cursor: pointer;
    background-color: #838383;
  }
`;

const CurrentChat = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CurrentChatHeader = styled.div`
  display: flex;
  width: 100%;
  column-gap: 20px;
  img {
    width: 30px;
  }
`;

const MessagesContainer = styled.div`
  width: 100%;
  padding: 5px;
  height: 80%;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 13px;
    border-radius: 20px;
  }

  &::-webkit-scrollbar-track {
    background-color: #565656;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #707070;
    border-radius: 10px;
  }
`;

const SendMessageContainer = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
`;

const SendMessageButton = styled.button`
  height: 100%;
  width: 50px;
  border: 0;
  background-color: #7a7a7a;
  border-radius: 0 5px 5px 0;
  img {
    filter: invert(1);
    width: 20px;
  }
  &:hover {
    cursor: pointer;
    background-color: #a72626;
  }
`;

export default Chat;
