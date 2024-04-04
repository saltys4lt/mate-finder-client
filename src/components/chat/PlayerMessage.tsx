import React, { FC } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/Message';
import { toMessageTime } from '../../util/toMessageTime';
import { messageToLink } from '../../util/MessageToLink';
import { DoneAll, Done } from '@mui/icons-material';
interface PlayerMessageProps {
  message: Message;
}

const PlayerMessage: FC<PlayerMessageProps> = ({ message }) => {
  return (
    <MessageContainer>
      <MessageHeader>
        <b>{message.nickname}</b> <span>{toMessageTime(message.time)}</span>
      </MessageHeader>
      <MessageText>
        {messageToLink(message.text)}{' '}
        {message.checked ? (
          <DoneAll style={{ position: 'absolute', fontSize: 18, right: '6px', bottom: '2px' }} />
        ) : (
          <Done style={{ position: 'absolute', fontSize: 18, right: '4px', bottom: '2px' }} />
        )}
      </MessageText>
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  column-gap: 5px;
  color: #d1d1d1;
  margin-left: 5px;
`;

const MessageText = styled.p`
  background-color: #555;
  position: relative;
  padding: 5px 20px 17px 12px;

  border-radius: 3px 5px 5px 3px;
  max-width: 350px;

  color: var(--main-text-color);
  text-align: left;
  word-wrap: break-word;
  a {
    color: #d1d1d1;
  }
`;

export default PlayerMessage;
