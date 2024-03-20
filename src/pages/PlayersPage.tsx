import Container from '../components/Container';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Pagination } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { PlayersCs2Filters } from '../types/queryTypes/PlayersC2Filters';
import { useQuery } from '../hooks/useQuery';
import { takeQueryFromUrl } from '../util/takeQueryFromUrl';
import fetchPlayers from '../redux/playerThunks/fetchPlayers';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import MapsImages from '../consts/MapsImages';
import { getAgeString } from '../util/getAgeString';
import CommonButton from '../components/UI/CommonButton';
import FilterBar from '../components/FilterBar';
import { FilterPurposes } from '../consts/enums/FilterPurposes';
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
  const queryParams: PlayersCs2Filters = takeQueryFromUrl(query);
  const [searchParams, setSearchParams] = useSearchParams();
  const players = useSelector((state: RootState) => state.playerReducer.players);
  const pages = useSelector((state: RootState) => state.playerReducer.pages);

  const userElo: number = useSelector((state: RootState) => state.userReducer.user?.cs2_data?.elo) as number;

  const [playersFilter, setPlayersFilter] = useState<PlayersCs2Filters | null>(null);
  const [searchBarValue, setSearchBarValue] = useState<string>('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Object.keys(queryParams).length) {
      if (!queryParams.page || Number(queryParams.page) > pages || (Number(queryParams.page) < 1 && players)) {
        console.log(pages);
        setSearchParams({ ...queryParams, page: '1' });
      } else if (queryParams.category !== 'all' && queryParams.category !== 'recs') {
        setSearchParams({ ...queryParams, category: 'all' });
      } else {
        if (queryParams.category === 'recs') {
          setPlayersFilter({ ...queryParams, maxEloValue: (userElo + 150).toString(), minEloValue: (userElo - 200).toString() });
        } else setPlayersFilter(queryParams as PlayersCs2Filters);
      }
    } else {
      setSearchParams({ page: '1', category: 'all' });
    }

    return () => {};
  }, [searchParams]);

  useEffect(() => {
    if (playersFilter) {
      dispatch(fetchPlayers(playersFilter));
    }
    return () => {};
  }, [playersFilter]);

  const handleChangeSearchBar = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(e.target.value);
  };

  const handleSearch = () => {
    const playerFilters: PlayersCs2Filters = playersFilter as PlayersCs2Filters;
    if (searchBarValue) playerFilters.searchQuery = searchBarValue;
    if (playerFilters.category === 'all') {
      setSearchParams({ ...playerFilters });
    }

    dispatch(fetchPlayers(playerFilters));
  };

  const handleChangeCategory = (e: MouseEvent<HTMLButtonElement>) => {
    const category = e.currentTarget.value as 'all' | 'recs';
    setSearchBarValue('');

    setSearchParams({ category });
  };

  const handleChangePage = (page: number) => {
    setSearchParams({ ...searchParams, page: page.toString() });
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
            <PlayersCategories>
              <CategoryButton
                onClick={(e) => {
                  handleChangeCategory(e);
                }}
                value={'all'}
                disabled={playersFilter?.category === 'all'}
              >
                Все
              </CategoryButton>
              <CategoryButton
                onClick={(e) => {
                  handleChangeCategory(e);
                }}
                value={'recs'}
                disabled={playersFilter?.category === 'recs'}
              >
                Рекомендуемые
              </CategoryButton>
            </PlayersCategories>
            <ListContainerBackground>
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
                  <h3 style={{ marginTop: '30px', textAlign: 'center', color: '#fff' }}>По вашему запрос ничего не найдено =\</h3>
                )}
              </ListContainer>
            </ListContainerBackground>

            {!playersFilter ? (
              <div></div>
            ) : (
              <ThemeProvider theme={theme}>
                <Pagination
                  count={pages}
                  color='primary'
                  page={Number(playersFilter?.page)}
                  onChange={(_, value: number) => {
                    handleChangePage(value);
                  }}
                />
              </ThemeProvider>
            )}
          </LeftContainer>
          <RightContainer>
            <FilterBar filters={playersFilter as PlayersCs2Filters} setFilters={setPlayersFilter} purpose={FilterPurposes.PlayersCs2} />
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
  height: 90vh;
`;

const LeftContainer = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const ListContainerBackground = styled.div`
  background-color: #2f2f2f;
  height: 80%;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
`;
const ListContainer = styled.div`
  background-color: #2f2f2f;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  padding-inline: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 13px;
    border-radius: 20px;
  }

  &::-webkit-scrollbar-track {
    background-color: #565656;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #707070;
    border-radius: 10px;
  }
`;
const ListItem = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  width: 100%;

  padding: 15px 10px;
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

const PlayersCategories = styled.div`
  align-self: flex-start;
  display: flex;
  column-gap: 20px;
`;

const CategoryButton = styled(CommonButton)`
  border-color: #d82f2f;
  &:disabled {
    &:hover {
      border-color: #d82f2f;
      cursor: auto;
    }
  }
`;

export default PlayersPage;
