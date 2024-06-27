import { FC } from 'react';
import styled from 'styled-components';
import { Message } from '../../types/Message';
import { toMessageTime } from '../../util/toMessageTime';
import { messageToLink } from '../../util/MessageToLink';
import { Done, DoneAll } from '@mui/icons-material';
interface MessageProps {
  message: Message;
}
const UserMessage: FC<MessageProps> = ({ message }) => {
  return (
    <MessageContainer>
      <MessageHeader>
        <span>{toMessageTime(message.time)}</span>
      </MessageHeader>
      <MessageText>
        {messageToLink(message.text)}

        {message.checked.find((checkedBy) => checkedBy.isChecked) ? (
          <DoneAll style={{ position: 'absolute', fontSize: 18, right: '6px', bottom: '3px' }} />
        ) : (
          <Done style={{ position: 'absolute', fontSize: 18, right: '6px', bottom: '2px' }} />
        )}
      </MessageText>
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
  background-color: var(--main-red-color);
  position: relative;
  border-radius: 5px 3px 3px 5px;
  padding: 5px 10px 20px 10px;
  color: var(--main-text-color);
  word-wrap: break-word;

  max-width: 350px;

  a {
    color: #d1d1d1;
  }
`;

export default UserMessage;
