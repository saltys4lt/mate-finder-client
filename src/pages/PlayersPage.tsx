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
import CommonButton from '../components/UI/CommonButton';
import FilterBar from '../components/FilterBar';
import { PagePurposes } from '../consts/enums/PagePurposes';
import List from '../components/List';
import Cs2Data from '../types/Cs2Data';
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

  const cs2Data: Cs2Data = useSelector((state: RootState) => state.userReducer.user?.cs2_data) as Cs2Data;

  const [playersFilter, setPlayersFilter] = useState<PlayersCs2Filters | null>(null);
  const [FilterValues, setFilterValues] = useState<PlayersCs2Filters | null>(null);
  const [hasStateChanged, setHasStateChanged] = useState(false);

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
          setPlayersFilter({
            ...queryParams,
            maxEloValue: (cs2Data.elo + 150).toString(),
            minEloValue: (cs2Data.elo - 200).toString(),
            minKdValue: (cs2Data.kd - 0.15).toString(),
            maxKdValue: (cs2Data.kd + 0.2).toString(),
          });
        } else setPlayersFilter(queryParams as PlayersCs2Filters);
      }
    } else {
      setSearchParams({ page: '1', category: 'all' });
    }
    if (queryParams.searchQuery) {
      setSearchBarValue(queryParams.searchQuery);
    }
    setFilterValues({ ...(queryParams as PlayersCs2Filters) });
    return () => {};
  }, [searchParams]);

  useEffect(() => {
    if (playersFilter) {
      dispatch(fetchPlayers(playersFilter));
    }
    return () => {};
  }, [playersFilter]);

  const handleChangeSearchBar = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchBarValue(e.target.value);
  };

  const handleSearch = () => {
    const currentPlayersFilters: PlayersCs2Filters = playersFilter as PlayersCs2Filters;
    if (searchBarValue) {
      currentPlayersFilters.searchQuery = searchBarValue;
    } else {
      delete currentPlayersFilters.searchQuery;
    }

    const commonFilters: PlayersCs2Filters = Object.assign(currentPlayersFilters, FilterValues as PlayersCs2Filters);
    console.log(FilterValues);
    if (currentPlayersFilters.category === 'all') {
      setSearchParams({ ...commonFilters });
    } else {
      delete currentPlayersFilters.maxEloValue;
      delete currentPlayersFilters.minEloValue;
      delete currentPlayersFilters.maxKdValue;
      delete currentPlayersFilters.minKdValue;
      setSearchParams({ ...commonFilters });
    }
  };

  const handleChangeCategory = (e: MouseEvent<HTMLButtonElement>) => {
    const category = e.currentTarget.value as 'all' | 'recs';
    setSearchBarValue('');
    setSearchParams({ category });
  };

  const handleChangePage = (page: number) => {
    if (page.toString() !== queryParams.page) setSearchParams({ ...searchParams, page: page.toString() });
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
            <List purpose={PagePurposes.PlayersCs2} data={players} />
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
            <FilterBar filters={FilterValues as PlayersCs2Filters} setFilters={setFilterValues} purpose={PagePurposes.PlayersCs2} />
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
