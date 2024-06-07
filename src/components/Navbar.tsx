import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { RootState, useAppDispatch } from '../redux';
import { changeLoginState, changeRegState } from '../redux/modalSlice';
import { changeIsAuth } from '../redux/userSlice';
import { useEffect, useState } from 'react';
import logoImg from '../assets/images/logo.png';
import logout from '../assets/images/logout.png';
import { resetChats } from '../redux/chatSlice';
import { ioSocket } from '../api/webSockets/socket';
import { changeFriendsModalState } from '../redux/modalSlice';
import ClientUser from '../types/ClientUser';
import ReactDOMServer from 'react-dom/server';
import FriendslistModal from './FriendslistModal';
const Navbar = () => {
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  console.log(user);
  const isAuth = useSelector((state: RootState) => state.userReducer.isAuth);
  const [isGameProfileExist, setIsGameProfileExist] = useState<boolean>(false);
  useEffect(() => {
    if (user?.cs2_data || user?.valorant_data) setIsGameProfileExist(true);
  }, [user]);

  const openRegModal = () => {
    document.documentElement.style.overflowY = 'hidden';
    dispatch(changeRegState(true));
  };

  const openLoginModal = () => {
    document.documentElement.style.overflowY = 'hidden';
    dispatch(changeLoginState(true));
  };

  const navigateToTeamPage = () => {
    if (user.teams.length > 0) {
      navigate(`/team/${user?.teams[0].name}`);
    } else if (user.memberOf.length > 0) {
      navigate(`/team/${user?.memberOf[0].team.name}`);
    } else {
      if (user.cs2_data) {
        const NoTeamAlert = () => {
          return (
            <div style={{ textAlign: 'center' }}>
              <h3>У вас нет своей команды :&#40;</h3>
              <p>Но вы можете создать ее или вступить в существующую:D</p>
            </div>
          );
        };
        Swal.fire({
          html: ReactDOMServer.renderToString(<NoTeamAlert />),
          confirmButtonText: 'Создать',
          showCancelButton: true,
          cancelButtonText: 'Отмена',
          showDenyButton: true,
          denyButtonColor: '#0062b8',
          denyButtonText: 'Найти',
        }).then((res) => {
          if (res.isConfirmed) {
            navigate('/team-creator');
          }
          if (res.isDenied) {
            navigate('/teams/?page=1&category=all');
          }
        });
      }
    }
  };
  const handleExit = () => {
    Swal.fire({
      title: 'Уверены?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#a4a4a4',
      confirmButtonText: 'Выйти',
      cancelButtonText: 'Отмена',
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove('token');
        dispatch(resetChats());
        dispatch(changeLoginState(false));

        dispatch(changeIsAuth(false));
        ioSocket.emit('leaveAllRooms');
        ioSocket.removeListener('friendRequest');
        ioSocket.removeListener('friendRequestAction');
        ioSocket.removeListener('friendRequestToUser');
        ioSocket.removeListener('friendRequestActionToUser');
        ioSocket.removeListener('teamRequest');
        ioSocket.removeListener('leaveTeam');
        ioSocket.removeListener('answerTeamRequest');
        ioSocket.removeListener('cancelTeamRequest');
        navigate('/');
      }
    });
  };
  const navigate = useNavigate();
  return (
    <NavbarContainer>
      {isGameProfileExist && <FriendslistModal />}
      <LogoWrapper
        onClick={() => {
          navigate('/');
        }}
      >
        <LogoImage src={logoImg} />
        <LogoText>
          Squad
          <LogoTextSpan>Link</LogoTextSpan>
        </LogoText>
      </LogoWrapper>
      {isAuth ? (
        <AuthedNavbar>
          <NavLinks>
            <StraightLink to={'/'}>Главная</StraightLink>

            <StraightLink to={isGameProfileExist ? '/players?page=1&category=all' : '/'}>Игроки</StraightLink>
            <StraightLink to={isGameProfileExist ? '/teams?page=1&category=all' : '/'}>Команды</StraightLink>

            <DropDown>
              <NavLink>Другое</NavLink>
              <DropDownContent>
                <DropDownText
                  onClick={() => {
                    dispatch(changeFriendsModalState(true));
                  }}
                >
                  Друзья
                </DropDownText>
                <DropDownText onClick={navigateToTeamPage}>Команда</DropDownText>
                <DropDownLink to={'/news'}>Новости</DropDownLink>
              </DropDownContent>
            </DropDown>
          </NavLinks>
          <NavProfile to={`/profile/${user?.nickname}`}>
            <NavNickname>{user?.nickname}</NavNickname>
            <NavAvatar src={user?.user_avatar} />
          </NavProfile>
          <Exit src={logout} onClick={handleExit} />
        </AuthedNavbar>
      ) : (
        <AuthButtons>
          <LoginButton onClick={openLoginModal}>Вход</LoginButton>
          <RegistrationButton onClick={openRegModal}>Регистрация</RegistrationButton>
        </AuthButtons>
      )}
    </NavbarContainer>
  );
};

const NavbarContainer = styled.nav`
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AuthButtons = styled.div`
  display: flex;
  column-gap: 10px;
`;
const LoginButton = styled.button`
  font-weight: 500;
  font-size: 16px;
  font-family: montserrat;

  text-transform: uppercase;
  color: #fff;
  padding: 5px 16px;
  border-radius: 4px;
  background-color: transparent;
  height: 32px;
  width: 160px;
  border: 1px solid #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05);
    background-color: #3e3e3e;
  }
`;

const RegistrationButton = styled.button`
  font-weight: 500;
  font-size: 16px;
  font-family: montserrat;
  text-transform: uppercase;
  color: var(--main-text-color);
  padding: 5px 16px;
  border-radius: 4px;
  background: radial-gradient(circle at 10% 20%, rgb(199, 96, 11) 0%, rgb(106, 55, 55) 100.7%);
  background-size: 100%;
  height: 32px;

  width: 160px;
  border: 1px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-size: 150%;
    transform: scale(1.05);
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 100%;
  max-height: 70px;
  object-fit: cover;
  border-radius: 5px;
`;
const LogoText = styled.h1`
  margin-left: 20px;
  font-size: 28px;
  background: linear-gradient(100deg, #e28615, #d9950d);
  -webkit-background-clip: text;
  color: transparent;
`;

const LogoTextSpan = styled.span`
  color: #fff;
`;

const AuthedNavbar = styled.div`
  width: 70%;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const NavLinks = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15%;
`;

const StraightLink = styled(Link)`
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:after {
    content: ' ';
    display: block;
    width: 100%;
    height: 2px;
    background: linear-gradient(45deg, #f33e3e, #d84e17);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  &:hover {
    transform: scale(1.1);
    color: #ffdede;
  }
  &:hover::after {
    opacity: 1;
  }
`;

const NavLink = styled.div`
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:after {
    content: ' ';
    display: block;
    width: 100%;
    height: 2px;
    background: linear-gradient(45deg, #f33e3e, #d84e17);
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  &:hover {
    transform: scale(1.1);
    color: #ffdede;
  }
  &:hover::after {
    opacity: 1;
  }
`;

const NavNickname = styled.span`
  color: #fff;
  transition: all 0.2s ease-in-out;
`;
const NavAvatar = styled.img`
  display: block;
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  transition: transform 0.2s linear;
`;
const NavProfile = styled(Link)`
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  text-decoration: none;

  &:hover ${NavNickname} {
    color: #ffbf00;
    transform: scale(1.06);
  }
  &:hover ${NavAvatar} {
    transform: scale(1.03);
  }
`;

const Exit = styled.img`
  height: 40px;
  margin-left: 20px;
  cursor: pointer;

  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const DropDownContent = styled.div`
  border-radius: 5px;
  opacity: 0;
  width: 150px;
  position: absolute;

  transform: translateY(-400%);
  background-color: #fe8205;
  left: -50%;
  top: 20px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  transition: opacity 0.3s ease-in-out;
  box-shadow: 2px 3px 12px #a94b4b;
`;

const DropDownLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: #fff;
  padding: 12px 16px;
  cursor: pointer;
  &:hover {
    color: #333;
    transform: translate(1.5);
  }
`;

const DropDownText = styled.span`
  display: block;

  color: #fff;
  padding: 12px 16px;
  cursor: pointer;
  &:hover {
    color: #333;
    transform: translate(1.5);
  }
`;
const DropDown = styled.div`
  position: relative;
  &:hover ${DropDownContent} {
    transform: translate(0);

    opacity: 1;
  }
`;
export default Navbar;
