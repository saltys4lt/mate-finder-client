import React, { FC } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/Message';

interface MessageProps {
  message: Message;
}

const UserMessage: FC<MessageProps> = ({ message }) => {
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
  align-self: flex-end;
  display: flex;
  border-radius: 3px 0 0 3px;
  flex-direction: column;
  background-color: #787878;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  column-gap: 5px;
`;

const MessageText = styled.p``;

export default UserMessage;
