import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import { SteamAuth } from '../api/steamAuth';
import steamIcon from '../assets/images/steam-logo.png';
export const cancelRoutePopUp = () => {
  Swal.fire({
    iconHtml: ReactDOMServer.renderToString(<img style={{ width: 80, height: 80, objectFit: 'cover' }} src={steamIcon} />),
    text: 'Функция доступна только после steam аутентификации',
    showCancelButton: true,
    cancelButtonText: 'Отмена',
    confirmButtonText: 'Пройти',
  }).then((res) => {
    if (res.isConfirmed) {
      SteamAuth();
    }
  });
};
