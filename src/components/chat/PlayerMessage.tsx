import React, { FC } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/Message';

interface PlayerMessageProps {
  message: Message;
}

const PlayerMessage: FC<PlayerMessageProps> = ({ message }) => {
  return (
    <MessageContainer>
      <MessageHeader>
        <b>{message.nickname}</b> <span>{message.time}</span>
      </MessageHeader>
      <MessageText>{message.text}</MessageText>
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
`;

const MessageText = styled.p`
  background-color: #555;
`;

export default PlayerMessage;
