import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState, useAppDispatch } from '../../redux';
import { changeChatState } from '../../redux/modalSlice';
import { ioSocket } from '../../api/webSockets/socket';
import { useNavigate } from 'react-router-dom';
import CommonInput from '../UI/CommonInput';
import UserMessage from './UserMessage';
import PlayerMessage from './PlayerMessage';
import { Message } from '../../types/Message';

import { getChat, getMessage, setCurrentChat, updateChatMessages, updateMessage } from '../../redux/chatSlice';
import { Chat as IChat } from '../../types/Chat';
import ClientUser from '../../types/ClientUser';
import fetchChats from '../../redux/chatThunks/fetchChats';
import { formatDate } from '../../util/formatDate';
import SmsIcon from '@mui/icons-material/Sms';
import chatImg from '../../assets/images/chat.png';
import closeCross from '../../assets/images/close-cross.png';
import defaultUserAvatar from '../../assets/images/default-avatar.png';
import sendMessageIcon from '../../assets/images/message.png';

const Chat = () => {
  const isActive = useSelector((state: RootState) => state.modalReducer.chatIsActive);
  const chats: IChat[] = useSelector((state: RootState) => state.chatReducer.chats) as IChat[];
  const fetchChatsStatus = useSelector((state: RootState) => state.chatReducer.fetchChatsStatus);
  const currentChat = useSelector((state: RootState) => state.chatReducer.currentChat);
  const navigate = useNavigate();
  const user: ClientUser = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const messageContainer = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>('');

  const dispatch = useAppDispatch();
  const handleChangeChatState = (value: boolean) => {
    dispatch(changeChatState(value));
    if (currentChat && currentChat.messages.find((message) => !message.checked && message.nickname !== user.nickname)) {
      ioSocket.emit(
        'checkWholeChat',
        currentChat.messages.filter((message) => message.nickname !== user.nickname && !message.checked),
      );
    }
    setTimeout(() => {
      if (messageContainer.current) {
        messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
      }
    });
  };

  const handleChangeChat = (chat: IChat) => {
    if (chat.messages.find((message) => !message.checked && message.nickname !== user.nickname)) {
      ioSocket.emit(
        'checkWholeChat',
        chat.messages.filter((message) => message.nickname !== user.nickname && !message.checked),
      );
    }
    dispatch(setCurrentChat(chat));

    setTimeout(() => {
      if (messageContainer.current) {
        messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
      }
    });
  };

  const handleSendMessage = () => {
    if (message) {
      const newMessage: Message = {
        roomId: currentChat?.roomId as string,
        nickname: user?.nickname as string,
        text: message,
        time: new Date(),
        checked: false,
      };
      setMessage('');
      if (currentChat?.messages.length === 0) {
        ioSocket.emit('firstMessage', { ...currentChat, messages: [newMessage] });
      } else ioSocket.emit('sendMessage', newMessage);
    }
  };

  useEffect(() => {
    dispatch(fetchChats());
    ioSocket.on('connection', () => {});

    ioSocket.on('checkWholeChat', (checkedMessages: Message[]) => {
      dispatch(updateChatMessages(checkedMessages));
    });
    ioSocket.on('firstMessage', ({ chat, playerId }) => {
      if (playerId === user.id) {
        ioSocket.emit('join', chat.roomId);

        dispatch(getChat(chat));
        setTimeout(() => {
          if (messageContainer.current) {
            messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
          }
        });
      }
    });
    ioSocket.on('getMessage', (value: Message) => {
      if (value.roomId === currentChat?.roomId && value.nickname !== user.nickname && isActive) {
        ioSocket.emit('readMessage', value);
      }
      dispatch(getMessage(value));

      setTimeout(() => {
        if (messageContainer.current) {
          messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
        }
      });
    });

    ioSocket.on('readMessage', (value: Message) => {
      dispatch(updateMessage(value));
    });
    ioSocket.on('disconnect', () => {});

    if (messageContainer.current) {
      messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    }
    ioSocket.emit('connection');
    return () => {
      dispatch(changeChatState(false));
      ioSocket.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (chats.length !== 0) {
      ioSocket.emit('joinRooms', chats);
    }
  }, [chats]);

  useEffect(() => {
    if (currentChat || isActive) {
      ioSocket.removeListener('getMessage');
      ioSocket.on('getMessage', (value: Message) => {
        if (isActive && value.roomId === currentChat?.roomId && value.nickname !== user.nickname) {
          ioSocket.emit('readMessage', value);
        }

        dispatch(getMessage(value));

        setTimeout(() => {
          if (messageContainer.current) {
            messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
          }
        });
      });
    }
  }, [currentChat, isActive]);

  const uncheckedMessages = chats.reduce((acc, chat) => {
    const unreadMessages = chat.messages.filter((message) => !message.checked && message.nickname !== user.nickname);
    return acc + unreadMessages.length;
  }, 0);

  return fetchChatsStatus === 'pending' || fetchChatsStatus === 'idle' ? (
    <ChatButtonContainer>
      <ChatButton>
        <img src={chatImg} alt='' />
      </ChatButton>
    </ChatButtonContainer>
  ) : !isActive ? (
    <ChatButtonContainer>
      <ChatButtonInnerContainer data-unchecked={uncheckedMessages} $messages={uncheckedMessages}>
        <ChatButton onClick={() => handleChangeChatState(true)}>
          <img src={chatImg} alt='' />
        </ChatButton>
      </ChatButtonInnerContainer>
    </ChatButtonContainer>
  ) : (
    <OpenChatContainer>
      <OpenChat>
        <CloseButton onClick={() => handleChangeChatState(false)}>
          <img src={closeCross} alt='' />
        </CloseButton>
        <ChatList>
          {chats.length !== 0 ? (
            chats.map((chat) => (
              <ChatListItem
                data-unchecked={chat.messages.reduce(
                  (acc, message) => (message.nickname !== user.nickname && !message.checked ? acc + 1 : acc),
                  0,
                )}
                $messages={chat.messages.reduce(
                  (acc, message) => (message.nickname !== user.nickname && !message.checked ? acc + 1 : acc),
                  0,
                )}
                selected={chat.roomId === currentChat?.roomId}
                key={chat.roomId}
                onClick={() => handleChangeChat(chat)}
              >
                {!chat.team ? (
                  <>
                    <img
                      src={
                        chat.members.find((member) => member.id !== user?.id)?.user_avatar
                          ? chat.members.find((member) => member.id !== user?.id)?.user_avatar
                          : defaultUserAvatar
                      }
                      alt=''
                    />{' '}
                    <PartnerNickname>{chat.members.find((member) => member.id !== user?.id)?.nickname}</PartnerNickname>
                  </>
                ) : (
                  <>team</>
                )}
              </ChatListItem>
            ))
          ) : (
            <h3 style={{ textAlign: 'center', color: 'var(--main-text-color)' }}> У вас нет активных чатов</h3>
          )}
        </ChatList>

        <CurrentChat>
          {currentChat ? (
            !currentChat.team ? (
              <>
                <CurrentChatHeader
                  onClick={() => {
                    navigate(`/profile/${currentChat.members.find((member) => member.id !== user?.id)?.nickname}`);
                  }}
                >
                  <img
                    src={
                      currentChat.members.find((member) => member.id !== user?.id)?.user_avatar
                        ? currentChat.members.find((member) => member.id !== user?.id)?.user_avatar
                        : defaultUserAvatar
                    }
                    alt=''
                  />{' '}
                  <span>{currentChat.members.find((member) => member.id !== user?.id)?.nickname}</span>
                </CurrentChatHeader>
                <MessagesContainer ref={messageContainer}>
                  {currentChat.messages.length === 0 ? (
                    <p style={{ color: 'var(--main-text-color)', textAlign: 'center', marginTop: 20 }}>
                      Это будет ваше первое сообщение для{' '}
                      <span style={{ fontWeight: 700, color: '#f6f6f6', fontSize: 16 }}>
                        {currentChat.members.find((member) => member.id !== user?.id)?.nickname}
                      </span>
                      <br /> Насладитесь моментом перед отправкой :3
                    </p>
                  ) : (
                    currentChat.messages.map((message, index, messages) => (
                      <MessageComponent $isuser={message.nickname === user?.nickname ? '1' : ''} key={message.id}>
                        {((index !== 0 && new Date(message.time).getDate() !== new Date(messages[index - 1].time).getDate()) ||
                          index === 0) && <b style={{ textAlign: 'center', margin: '10px 0' }}>{formatDate(message.time)}</b>}
                        {message.nickname === user?.nickname ? <UserMessage message={message} /> : <PlayerMessage message={message} />}
                      </MessageComponent>
                    ))
                  )}
                </MessagesContainer>
                <SendMessageContainer
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <CommonInput
                    style={{ borderRadius: '5px 0 0 5px' }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Сообщение'
                  />
                  <SendMessageButton type='submit'>
                    <img src={sendMessageIcon} alt='' />
                  </SendMessageButton>
                </SendMessageContainer>
              </>
            ) : (
              <CurrentChatHeader>team</CurrentChatHeader>
            )
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                rowGap: '15px',
                color: 'var(--main-text-color)',
              }}
            >
              <div style={{ border: '2px solid var(--main-text-color)', borderRadius: '10px', padding: 20 }}>
                <SmsIcon sx={{ fontSize: 30 }} />
              </div>{' '}
              <p>Чат не выбран</p>
            </div>
          )}
        </CurrentChat>
      </OpenChat>
    </OpenChatContainer>
  );
};

const ChatButtonInnerContainer = styled.div<{ $messages: number }>`
  position: relative;
  display: block;

  &::before {
    content: ${(p) => (p.$messages != 0 ? 'attr(data-unchecked)' : '')};
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

const ChatButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1;
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
  width: 900px;
  height: 400px;
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
  display: flex;
  flex-direction: column;
  border-right: 1px solid #fff;
  row-gap: 5px;
`;

const ChatListItem = styled.div<{ selected: boolean; $messages: number }>`
  display: flex;
  position: relative;
  width: 100%;
  align-items: center;
  padding: 5px;
  column-gap: 10px;
  border-radius: 5px 0 0 5px;
  img {
    border-radius: 50%;
    width: 40px;
  }
  &:hover {
    cursor: pointer;
    background-color: #838383;
  }
  background-color: ${(p) => (p.selected ? '#838383' : 'transparent')};

  &::before {
    content: ${(p) => (p.$messages != 0 ? 'attr(data-unchecked)' : '')};
    position: absolute;
    display: block;
    text-align: center;
    border-radius: 50%;
    background-color: #cf2b2b;
    width: 20px;
    height: 20px;
    color: #fff;
    right: 0;
    top: 0;
    z-index: 1;
  }
`;
const PartnerNickname = styled.span`
  color: var(--main-text-color);

  font-size: 18px;
`;
const CurrentChat = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const CurrentChatHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  column-gap: 10px;
  font-weight: 700;
  color: #d1d1d1;
  font-size: 20px;
  img {
    width: 50px;
    border-radius: 50%;

    border: 2px solid;
    cursor: pointer;
  }
  span {
    cursor: pointer;
  }
`;

const MessagesContainer = styled.div`
  border-radius: 3px;
  width: 100%;
  padding: 5px;
  height: 80%;
  row-gap: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 7px;
    border-radius: 20px;
  }

  &::-webkit-scrollbar-track {
    background-color: #565656;
    border-radius: 3px;
    width: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    width: 1px;
    border-radius: 15px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #707070;
  }
  background: rgb(37, 37, 37);
  backdrop-filter: blur(100px);
`;

const MessageComponent = styled.div<{ $isuser: string }>`
  width: 100%;

  color: #d1d1d1;

  display: flex;
  flex-direction: column;
  justify-content: ${(p) => (p.$isuser ? 'flex-end' : 'flex-start')};
`;

const SendMessageContainer = styled.form`
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
