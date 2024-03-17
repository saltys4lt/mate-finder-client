import Container from '../components/Container';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Pagination } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import { useEffect, useState } from 'react';
import { fetchPlayersParams } from '../types/fetchPlayersParams';
import { useQuery } from '../hooks/useQuery';
import { takeQueryFromUrl } from '../util/takeQueryFromUrl';
import fetchPlayers from '../redux/playerThunks/fetchPlayers';
import { useSearchParams } from 'react-router-dom';
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffffff', // белый цвет
    },
  },
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Цвет номеров страниц
          borderColor: '#ffffff', // Цвет обводки
        },
      },
    },
  },
});

const PlayersPage = () => {
  const query = useQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const players = useSelector((state: RootState) => state.playerReducer.players);
  const pages = useSelector((state: RootState) => state.playerReducer.pages);

  const fetchPlayersStatus = useSelector((state: RootState) => state.playerReducer.fetchPlayersStatus);
  const [playersFilter, setPlayersFilter] = useState<fetchPlayersParams | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const queryParams: fetchPlayersParams = takeQueryFromUrl(query);

    if (Object.keys(queryParams).length) {
      if (!queryParams.page) {
        setSearchParams({ ...queryParams, page: '1' });
      }
    } else {
      setSearchParams({ page: '1' });
    }

    return () => {};
  }, []);

  useEffect(() => {
    const queryParams: fetchPlayersParams = takeQueryFromUrl(query);
    if (queryParams.page && Number(queryParams.page) > pages && players) {
      setSearchParams({ ...searchParams, page: '1' });
      queryParams.page = '1';
      setPlayersFilter(queryParams as fetchPlayersParams);
    } else {
      if (playersFilter) {
        dispatch(fetchPlayers(playersFilter));
      } else dispatch(fetchPlayers({ page: '1' }));
    }
  }, [playersFilter]);

  return (
    <Main>
      <Container>
        <MainContainer>
          <LeftContainer>
            <SearchBar>
              <SearchInput placeholder='Введите никнейм игрока...' />
              <SearchButton>Поиск</SearchButton>
            </SearchBar>
            <ListContainer></ListContainer>
            <ThemeProvider theme={theme}>
              <Pagination count={pages} color='primary' />
            </ThemeProvider>
          </LeftContainer>
          <RightContainer>
            <FilterBar></FilterBar>
          </RightContainer>
        </MainContainer>
      </Container>
    </Main>
  );
};

const Main = styled.main`
  padding-block: 20px;
`;

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  height: 95vh;
`;

const LeftContainer = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const RightContainer = styled.div`
  width: 28%;
  flex-direction: column;
  height: 100%;
  background-color: #2f2f2f;
  border-radius: 5px;
`;

const SearchBar = styled.div`
  background-color: #2f2f2f;
  width: 100%;
  height: 45px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  overflow: hidden;
`;
const ListContainer = styled.div`
  background-color: #2f2f2f;
  height: 85%;
  width: 100%;
  border-radius: 5px;
`;

const SearchInput = styled.input`
  width: 90%;
  height: 95%;
  border: 0;
  font-family: montserrat;
  padding-inline: 10px;
  &:focus {
    outline: 0;
  }
`;

const SearchButton = styled.button`
  width: 10%;
  height: 95%;
  border: 0;
  font-family: montserrat;

  background-color: #d82f2f;
  color: #fff;
  &:hover {
    cursor: pointer;
    background-color: #af2828;
  }
`;

const FilterBar = styled.div``;

export default PlayersPage;
