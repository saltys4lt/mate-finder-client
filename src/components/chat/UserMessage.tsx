import React, { FC } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/Message';
import { toMessageTime } from '../../util/toMessageTime';
import { messageToLink } from '../../util/MessageToLink';
interface MessageProps {
  message: Message;
}
const UserMessage: FC<MessageProps> = ({ message }) => {
  return (
    <MessageContainer>
      <MessageHeader>
        <b>Вы</b> <span>{toMessageTime(message.time)}</span>
      </MessageHeader>
      <MessageText>{messageToLink(message.text)}</MessageText>
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: column;
`;

const MessageHeader = styled.div`
  align-self: flex-end;
  display: flex;
  align-items: center;
  column-gap: 5px;
  color: #d1d1d1;
  margin-right: 5px;
`;

const MessageText = styled.p`
  background-color: #8f2121;

  border-radius: 5px 3px 3px 5px;
  padding: 5px 10px;
  color: #dedede;
  word-wrap: break-word;

  max-width: 350px;

  a {
    color: #d1d1d1;
  }
`;

export default UserMessage;
