import styled from 'styled-components';
import Navbar from './Navbar';
import Container from './Container';
import { Alert, AlertTitle } from '@mui/material';
import { SportsEsports } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';

import { changeGameProfileState } from '../redux/modalSlice';
import { SteamAuth } from '../api/steamAuth';

const Header = () => {
  const cs2_data = useSelector((state: RootState) => state.userReducer.user?.cs2_data);
  const valorant_data = useSelector((state: RootState) => state.userReducer.user?.valorant_data);
  const dispatch = useAppDispatch();
  const isAuth = useSelector((state: RootState) => state.userReducer.isAuth);

  return (
    <>
      <HeaderContainer>
        <Container>
          <Navbar />
        </Container>
      </HeaderContainer>
      {isAuth && (
        <>
          {cs2_data || valorant_data ? (
            <></>
          ) : (
            <Alert icon={<SportsEsports fontSize='inherit' />} severity='warning'>
              <>
                <AlertTitle> Почти готово! </AlertTitle>
                На данный момент вам доступны лишь второстепенные функции приложения. Для того что бы разблокировать функции, связанные с
                игроками и командами &nbsp;
                <span
                  style={{
                    color: '#000',
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    SteamAuth();
                  }}
                >
                  создайте игровой профиль
                </span>
                &nbsp; для <b>Counter-strike</b>
              </>
            </Alert>
          )}
        </>
      )}
    </>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  height: 90px;
  padding: 13px 0;
  background-color: rgb(31, 31, 31);
  color: #fff;
  display: flex;
  align-items: center;
`;

export default Header;
