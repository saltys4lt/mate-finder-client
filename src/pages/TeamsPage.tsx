import Container from '../components/Container';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Pagination } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { TeamsCs2Filters } from '../types/queryTypes/TeamsCs2Filters';
import { useQuery } from '../hooks/useQuery';
import { takeQueryFromUrl } from '../util/takeQueryFromUrl';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CommonButton from '../components/UI/CommonButton';
import FilterBar from '../components/FilterBar';
import { PagePurposes } from '../consts/enums/PagePurposes';
import List from '../components/List';
import Cs2Data from '../types/Cs2Data';
import Team from '../types/Team';
import { fetchTeams } from '../api/teamRequsts.ts/fetchTeams';

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

const TeamsPage = () => {
  const query = useQuery();
  const queryParams: TeamsCs2Filters = takeQueryFromUrl(query);
  const [searchParams, setSearchParams] = useSearchParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pagesCount, setPagesCount] = useState<number>(1);

  const cs2Data: Cs2Data = useSelector((state: RootState) => state.userReducer.user?.cs2_data) as Cs2Data;

  const [teamsFilters, setTeamsFilters] = useState<TeamsCs2Filters | null>(null);
  const [FilterValues, setFilterValues] = useState<TeamsCs2Filters | null>({
    roles: [],
  });

  useEffect(() => {
    if (Object.keys(queryParams).length) {
      if (!queryParams.page || Number(queryParams.page) > pagesCount || (Number(queryParams.page) < 1 && teams)) {
        setSearchParams({ ...queryParams, page: '1' });
      } else if (queryParams.category !== 'all' && queryParams.category !== 'recs') {
        setSearchParams({ ...queryParams, category: 'all' });
      } else {
        if (queryParams.category === 'recs') {
          setTeamsFilters({
            ...queryParams,

            roles: searchParams.getAll('roles'),
          });
        } else {
          setTeamsFilters({
            ...(queryParams as TeamsCs2Filters),
            roles: searchParams.getAll('roles'),
          });
        }
      }
    } else {
      setSearchParams({ page: '1', category: 'all' });
    }
    if (queryParams.searchQuery) {
      setFilterValues({ ...FilterValues, searchQuery: queryParams.searchQuery });
    }
    if (queryParams.category === 'recs')
      setFilterValues({
        ...FilterValues,

        roles: searchParams.getAll('roles'),
      });
    else setFilterValues({ ...(queryParams as TeamsCs2Filters), roles: searchParams.getAll('roles') });
    return () => {};
  }, [searchParams]);

  useEffect(() => {
    if (teamsFilters) {
      async () => {
        await fetchTeams(teamsFilters, setPagesCount, setTeams);
      };
    }
    return () => {};
  }, [teamsFilters]);

  const handleChangeSearchBar = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValues({ ...FilterValues, searchQuery: e.target.value });
  };

  const handleSearch = () => {
    const currentTeamsCs2Filters: TeamsCs2Filters = teamsFilters as TeamsCs2Filters;
    const searchBarValue = FilterValues?.searchQuery;
    if (searchBarValue) {
      currentTeamsCs2Filters.searchQuery = searchBarValue;
    } else {
      delete currentTeamsCs2Filters.searchQuery;
      delete FilterValues?.searchQuery;
    }

    const commonFilters: TeamsCs2Filters = Object.assign(currentTeamsCs2Filters, FilterValues as TeamsCs2Filters);
    for (const key of Object.keys(commonFilters)) {
      const value = (commonFilters as any)[key];
      if (value === '') {
        delete (commonFilters as any)[key];
      }
    }

    if (commonFilters.category === 'all') {
      setSearchParams({ ...commonFilters });
    } else {
      delete commonFilters.minElo;
      delete commonFilters.maxElo;

      setSearchParams({ ...commonFilters });
    }
  };

  const handleChangeCategory = (e: MouseEvent<HTMLButtonElement>) => {
    const category = e.currentTarget.value as 'all' | 'recs';
    setFilterValues({ ...FilterValues, searchQuery: '', category: category, roles: [] });
    setSearchParams({ category });
  };

  const handleChangePage = (page: number) => {
    if (page.toString() !== queryParams.page) setSearchParams({ ...queryParams, page: page.toString() });
  };
  return (
    <Main>
      <Container>
        <MainContainer>
          <LeftContainer>
            <FilterBar filters={FilterValues as TeamsCs2Filters} setFilters={setFilterValues} purpose={PagePurposes.TeamsCs2} />
          </LeftContainer>
          <RightContainer>
            <SearchBar
              inputPlaceholder='Название команды...'
              inputValue={FilterValues?.searchQuery as string}
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
                disabled={teamsFilters?.category === 'all'}
              >
                Все
              </CategoryButton>
              <CategoryButton
                onClick={(e) => {
                  handleChangeCategory(e);
                }}
                value={'recs'}
                disabled={teamsFilters?.category === 'recs'}
              >
                Рекомендуемые
              </CategoryButton>
            </PlayersCategories>
            <List purpose={PagePurposes.TeamsCs2} data={teams} />
            {!teamsFilters ? (
              <></>
            ) : (
              <ThemeProvider theme={theme}>
                <Pagination
                  count={pagesCount}
                  color='primary'
                  page={Number(teamsFilters?.page)}
                  onChange={(_, value: number) => {
                    handleChangePage(value);
                  }}
                />
              </ThemeProvider>
            )}
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
`;

const RightContainer = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;

const LeftContainer = styled.div`
  width: 28%;
  height: 100%;
  flex-direction: column;

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

export default TeamsPage;
