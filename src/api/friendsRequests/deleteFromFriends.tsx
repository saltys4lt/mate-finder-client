import Swal from 'sweetalert2';
import { ioSocket } from '../webSockets/socket';
import ReactDOMServer from 'react-dom/server';
import { FC } from 'react';

const Text: FC<{ nickname: string }> = ({ nickname }) => {
  return (
    <p style={{ fontSize: 19 }}>
      {' '}
      Удалить <strong>{nickname}</strong> из друзей ? 😰
    </p>
  );
};

export const deleteFromFriends = (myId: number, friendId: number, nickname: string) => {
  Swal.fire({
    icon: 'question',
    html: ReactDOMServer.renderToString(<Text nickname={nickname} />),
    confirmButtonText: 'Да',
    showCancelButton: true,
    cancelButtonText: 'Отмена',
  }).then((res) => {
    if (res.isConfirmed) {
      ioSocket.emit('deleteFromFriends', { myId, friendId });
    }
  });
};
