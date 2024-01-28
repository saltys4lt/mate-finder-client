import styled from "styled-components";
import Navbar from "./Navbar";
import Container from "./Container";
import { Alert, AlertTitle } from "@mui/material";
import { SportsEsports } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../redux";

const Header = () => {
  const csgo_data = useSelector(
    (state: RootState) => state.userReducer.user?.csgo_data
  );
  const valorant_data = useSelector(
    (state: RootState) => state.userReducer.user?.valorant_data
  );
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
          {csgo_data || valorant_data ? (
            <></>
          ) : (
            <Alert
              icon={<SportsEsports fontSize="inherit" />}
              severity="warning"
            >
              <AlertTitle> Почти готово! </AlertTitle>
              На данный момент вам доступны лишь второстепенные функции
              приложения. Для того что бы разблокировать функции, связанные с
              игроками и командами создайте игровой профиль для cs2 или valorant
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
  background-color: #202020;
  color: #fff;
  display: flex;
  align-items: center;
`;



export default Header;
