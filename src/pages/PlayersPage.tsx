import Container from '../components/Container';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Pagination } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { fetchPlayersParams } from '../types/fetchPlayersParams';
import { useQuery } from '../hooks/useQuery';
import { takeQueryFromUrl } from '../util/takeQueryFromUrl';
import fetchPlayers from '../redux/playerThunks/fetchPlayers';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MapsImages from '../consts/MapsImages';
import { getAgeString } from '../util/getAgeString';
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
  const [searchBarValue, setSearchBarValue] = useState('');
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

  const handleChangeSearchBar = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(e.target.value);
  };

  const handleSearch = () => {
    console.log('поиск игроков...');
  };

  return (
    <Main>
      <Container>
        <MainContainer>
          <LeftContainer>
            <SearchBar
              inputPlaceholder='Введите никнейм игрока...'
              inputValue={searchBarValue}
              buttonText='Поиск'
              inputFunc={handleChangeSearchBar}
              buttonFunc={handleSearch}
            />

            <ListContainer>
              {players ? (
                players.map((player) => (
                  <ListItem key={player.nickname}>
                    <PlayerInfo>
                      <PlayerInfoHeader>
                        <PlayerLvl src={player.cs2_data?.lvlImg} />
                        <PlayerNickname>{player.nickname}</PlayerNickname>

                        <PlayerAge>{getAgeString(player.age)}</PlayerAge>
                      </PlayerInfoHeader>
                      <PlayerInfoInner>
                        <PlayerAvatar src={player.user_avatar ? player.user_avatar : '/images/default-avatar.png'} />
                        <PlayerStats>
                          <PlayerStatsText>
                            ELO: <PlayerStatsTextSpan>{player.cs2_data?.elo}</PlayerStatsTextSpan>
                          </PlayerStatsText>
                          <PlayerStatsText>
                            КД: <PlayerStatsTextSpan>{player.cs2_data?.kd}</PlayerStatsTextSpan>
                          </PlayerStatsText>
                          <PlayerStatsText>
                            Процент убийств в голову: <PlayerStatsTextSpan>{player.cs2_data?.hs}%</PlayerStatsTextSpan>
                          </PlayerStatsText>

                          <PlayerStatsText>
                            Процент побед: <PlayerStatsTextSpan>{player.cs2_data?.winrate}%</PlayerStatsTextSpan>
                          </PlayerStatsText>
                          <PlayerStatsText>
                            Всего матчей: <PlayerStatsTextSpan>{player.cs2_data?.matches}</PlayerStatsTextSpan>
                          </PlayerStatsText>
                          <PlayerStatsText>
                            Побед: <PlayerStatsTextSpan>{player.cs2_data?.wins}</PlayerStatsTextSpan>
                          </PlayerStatsText>
                        </PlayerStats>
                      </PlayerInfoInner>
                      <RolesContainer>
                        <PlayerStatsText>Роли:</PlayerStatsText>
                        <Roles>{player?.cs2_data?.roles?.map((role) => <Role key={role.cs2Role.name}>{role.cs2Role.name}</Role>)}</Roles>
                      </RolesContainer>
                      <MapsContainer>
                        <PlayerStatsText>Карты:</PlayerStatsText>
                        <Maps>
                          {player?.cs2_data?.maps?.map((map) => (
                            <img key={MapsImages[map.cs2Map.name]} src={MapsImages[map.cs2Map.name]} />
                          ))}
                        </Maps>
                      </MapsContainer>
                    </PlayerInfo>
                  </ListItem>
                ))
              ) : (
                <h3>Никого нету =\</h3>
              )}
            </ListContainer>

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
  height: 120vh;
`;

const LeftContainer = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  width: 100%;
  height: 400px;
  padding: 10px 10px;
  background-color: #1f1f1f;
  border-radius: 5px;
`;

const PlayerAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;
const PlayerInfoInner = styled.div`
  display: flex;
  align-items: center;
  padding-block: 10px;
  column-gap: 20px;
`;
const PlayerInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PlayerInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const PlayerNickname = styled.p`
  margin-left: 7px;
  color: #fff;
  font-size: 18px;
`;
const PlayerLvl = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const PlayerStats = styled.div`
  margin-top: 20px;
  width: 60%;
  display: flex;
  column-gap: 30px;
  row-gap: 10px;
  flex-wrap: wrap;
`;
const PlayerStatsText = styled.p`
  color: #9f9f9f;
  font-size: 14px;
  white-space: nowrap;
`;
const PlayerStatsTextSpan = styled.span`
  color: #cacaca;
  font-size: 15px;
  font-weight: 700;
`;

const PlayerAge = styled.p`
  color: #e0e0e0;
  font-size: 14px;
  margin-left: 10px;
`;

const RolesContainer = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
  flex-wrap: wrap;
  @media (max-width: 980px) {
    flex-wrap: wrap;
  }
  &:last-child {
    padding: 0;
    border: 0;
  }
`;

const Roles = styled.div`
  display: flex;
  column-gap: 20px;
`;

const Role = styled.div`
  color: #fff;
`;

const MapsContainer = styled(RolesContainer)``;

const Maps = styled(Roles)`
  img {
    width: 70px;
    border-radius: 5px;
  }
`;

const RightContainer = styled.div`
  width: 28%;
  flex-direction: column;
  height: 100%;
  background-color: #2f2f2f;
  border-radius: 5px;
`;

const ListContainer = styled.div`
  background-color: #2f2f2f;
  height: 85%;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #2f2f2f #f1f1f1;

  &::-webkit-scrollbar {
    width: 20px;
    border-radius: 20px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 10px;
    box-shadow: inset 0 0 5px grey;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
    border-radius: 10px;
  }
`;

const FilterBar = styled.div``;

export default PlayersPage;
