import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { RootState, useAppDispatch } from '../redux';
import { changeLoginState, changeRegState } from '../redux/modalSlice';
import { changeIsAuth } from '../redux/usersSlice';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.userReducer.user);
  const isAuth = useSelector((state: RootState) => state.userReducer.isAuth);
  const [isGameProfileExist, setIsGameProfileExist] = useState<boolean>(false);
  useEffect(() => {
    if (user?.cs2_data || user?.valorant_data) setIsGameProfileExist(true);
  }, [user]);

  const openRegModal = () => {
    document.documentElement.style.overflowY = 'hidden';
    dispatch(changeRegState(true));
  };
  console.log(user);
  const openLoginModal = () => {
    document.documentElement.style.overflowY = 'hidden';
    dispatch(changeLoginState(true));
  };
  const handleExit = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You need to enter your data next time',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#a4a4a4',
      confirmButtonText: 'Leave',
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove('token');
        dispatch(changeIsAuth(false));
      }
    });
  };
  const navigate = useNavigate();
  return (
    <NavbarContainer>
      <LogoWrapper
        onClick={() => {
          navigate('/');
        }}
      >
        <LogoImage src='/images/header1-logo.jpeg' />
        <LogoText>
          Squad
          <LogoTextSpan>Link</LogoTextSpan>
        </LogoText>
      </LogoWrapper>
      {isAuth ? (
        <AuthedNavbar>
          <NavLinks>
            <NavLink
              onClick={() => {
                navigate('/');
              }}
            >
              Home
            </NavLink>
            <DropDown>
              <NavLink>Players</NavLink>
              <DropDownContent>
                <DropDownLink to={isGameProfileExist ? '/players' : '/'}>Find players</DropDownLink>
                <DropDownLink to={isGameProfileExist ? '/friends' : '/'}>Friend list</DropDownLink>
              </DropDownContent>
            </DropDown>
            <DropDown>
              <NavLink>Teams</NavLink>
              <DropDownContent>
                <DropDownLink to={isGameProfileExist ? '/team-creator' : '/'}>Create a Team</DropDownLink>
                <DropDownLink to={isGameProfileExist ? '/teams' : '/'}>Teams list</DropDownLink>
              </DropDownContent>
            </DropDown>
            <DropDown>
              <NavLink>Other</NavLink>
              <DropDownContent>
                <DropDownLink to={`/profile/${user?.nickname}`}>Profile</DropDownLink>
                <DropDownLink to={'/matches'}>Matches</DropDownLink>
                <DropDownLink to={'/news'}>News</DropDownLink>
              </DropDownContent>
            </DropDown>
          </NavLinks>
          <NavProfile to={`/profile/${user?.nickname}`}>
            <NavNickname>{user?.nickname}</NavNickname>
            <NavAvatar src={user?.user_avatar} />
          </NavProfile>
          <Exit src='/images/logout.png' onClick={handleExit} />
        </AuthedNavbar>
      ) : (
        <AuthButtons>
          <LoginButton onClick={openLoginModal}>login</LoginButton>
          <RegistrationButton onClick={openRegModal}>sign up</RegistrationButton>
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
  color: #fff;
  padding: 5px 16px;
  border-radius: 4px;
  background: radial-gradient(circle at 10% 20%, rgb(197, 84, 76) 0%, rgb(73, 57, 57) 100.7%);
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
  height: 60px;
  border-radius: 5px;
`;
const LogoText = styled.h1`
  margin-left: 20px;
  font-size: 28px;
  background: linear-gradient(45deg, #f33e3e, #949494);
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
  width: 50px;
  height: 50px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.2s ease-in-out;
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
    transform: scale(1.06);
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
  background-color: #cb3030;
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
const DropDown = styled.div`
  position: relative;
  &:hover ${DropDownContent} {
    transform: translate(0);

    opacity: 1;
  }
`;
export default Navbar;
