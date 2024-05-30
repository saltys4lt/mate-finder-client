import { useEffect, useState } from 'react';
import { useAppDispatch } from '../redux';
import { ioSocket } from '../api/webSockets/socket';
import { Chat } from '../types/Chat';
import { Message } from '../types/Message';
import { updateChatMessages, getChat, getMessage, updateMessage } from '../redux/chatSlice';
import { changeChatState } from '../redux/modalSlice';

export const useChatEvents = (id: number, currentChat: Chat | null, isActive: boolean, messageContainer: HTMLDivElement | null) => {
  const dispatch = useAppDispatch();
  const [serverReloaded, setIsServerReloaded] = useState<boolean>(true);
  const setupEvents = () => {
    ioSocket.on('connection', () => {
      ioSocket.off('checkWholeChat');
      ioSocket.off('firstMessage');
      ioSocket.off('getMessage');
      ioSocket.off('readMessage');

      setIsServerReloaded(true);
    });

    ioSocket.on('checkWholeChat', (checkedMessages: Message[]) => {
      dispatch(updateChatMessages(checkedMessages));
    });
    ioSocket.on('firstMessage', ({ chat, playerId }) => {
      if (playerId === id) {
        ioSocket.emit('join', chat.roomId);

        dispatch(getChat(chat));
        setTimeout(() => {
          if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
          }
        });
      }
    });
    ioSocket.on('getMessage', (value: Message) => {
      if (value.roomId === currentChat?.roomId && value.userId !== id && isActive) {
        ioSocket.emit('readMessage', { message: value, userId: id });
      }
      dispatch(getMessage(value));

      setTimeout(() => {
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
      });
    });

    ioSocket.on('readMessage', (value: Message) => {
      console.log(value);
      dispatch(updateMessage(value));
    });

    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
    return () => {
      dispatch(changeChatState(false));
      ioSocket.off('checkWholeChat');
      ioSocket.off('firstMessage');
      ioSocket.off('getMessage');
      ioSocket.off('readMessage');
    };
  };

  useEffect(() => {
    if (serverReloaded) {
      setupEvents();
      setIsServerReloaded(false);
    }
  }, [id, serverReloaded]);
};
