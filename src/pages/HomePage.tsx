import styled from 'styled-components';
import Container from '../components/Container';
import Modal from '../components/Modal';
import { RootState, useAppDispatch } from '../redux';
import { changeGameProfileState } from '../redux/modalSlice';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Cs2Data from '../types/Cs2Data';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setGameCreationActive } from '../redux/usersSlice';

const HomePage = () => {
  const user = useSelector((state: RootState) => state.userReducer.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const openGameProfileModal = () => {
    document.documentElement.style.overflowY = 'hidden';
    dispatch(changeGameProfileState(true));
  };
  const [isGameProfileExist, setIsGameProfileExist] = useState<boolean>(false);

  useEffect(() => {
    if (user?.cs2_data || user?.valorant_data) setIsGameProfileExist(true);

    document.documentElement.style.overflowY = 'visible';
    if (Cookies.get('_csData')) {
      const _csData = Cookies.get('_csData');
      if (_csData === 'exist') {
        Swal.fire({
          icon: 'warning',
          title: `Ошибочка`,
          text: `Такой аккаунт уже привязан`,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      if (_csData === 'noFaceit') {
        Swal.fire({
          icon: 'question',
          title: `Что-то не так`,
          text: `Похоже ваш steam аккаунт не привязан к faceit`,
          showConfirmButton: false,
          timer: 3000,
        });
      } else if (_csData !== 'noFaceit' && _csData !== 'exist') {
        const csData: Cs2Data = JSON.parse(_csData as string);
        if (csData.elo) {
          Cookies.set('_gc', 'cs2');
          dispatch(setGameCreationActive('cs2'));
          Swal.fire({
            icon: 'success',
            title: `faceit успешно подключен`,
            text: `Осталось лишь дополнить ваши данные по команде, приступим?`,
            showDenyButton: true,
            confirmButtonText: 'Да',
            denyButtonText: 'Нет',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/creation/cs2');
            }
            if (result.isDenied) {
              Swal.fire({
                text: `Теперь статистика отображается в вашем профиле. Хотите посмотреть?`,
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: 'Перейти в профиль',
                cancelButtonText: 'Остаться тут',
              }).then((result) => {
                if (result.isConfirmed) {
                  Cookies.remove('_gc');
                  navigate(`/profile/${user?.nickname}`);
                }
              });
            }
          });
        }
      }
    }

    Cookies.remove('_csData');
  }, []);

  return (
    <>
      <main>
        <MatchesBar />
        <Container>
          <MainContent>
            <Modal />
            <ContentButtons>
              <ContentLink
                onClick={() => {
                  navigate(isGameProfileExist ? '/players' : '/');
                }}
              >
                Find Players{' '}
              </ContentLink>
              <ContentLink
                onClick={() => {
                  navigate(isGameProfileExist ? '/teams' : '/');
                }}
              >
                Find Your Team
              </ContentLink>
              <GameProfileButton onClick={openGameProfileModal}>Create Game Profile</GameProfileButton>
            </ContentButtons>
            <ContentNews></ContentNews>
          </MainContent>
        </Container>
      </main>
    </>
  );
};

const MatchesBar = styled.div`
  width: 100%;
  height: 100px;
  background-color: #333;
`;

const MainContent = styled.section`
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: space-between;
  padding: 40px 0;
`;

const ContentButtons = styled.div`
  width: 48%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const ContentNews = styled.div`
  width: 48%;
  background-color: #575757;
`;
const ContentLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 70px;
  font-weight: 400;
  font-size: 18px;
  font-family: montserrat;
  text-transform: uppercase;
  color: #fff;
  padding: 5px 16px;
  border-radius: 4px;
  background: radial-gradient(circle at 20% 100%, rgb(145, 43, 36) 30%, rgb(224, 6, 6) 200%);

  background-size: 100%;
  text-align: center;

  width: 300px;
  border: 1px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    background-size: 150%;
  }
`;
const GameProfileButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 70px;
  font-weight: 400;
  font-size: 18px;
  font-family: montserrat;
  text-transform: uppercase;
  color: #fff;
  padding: 5px 16px;
  border-radius: 4px;
  background: radial-gradient(circle at 10% 100%, rgb(177, 139, 16) 30%, rgb(0, 0, 0) 200%);

  background-size: 100%;
  text-align: center;

  width: 300px;
  border: 1px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    background-size: 150%;
  }
`;

export default HomePage;
