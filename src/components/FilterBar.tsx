import { FC } from 'react';
import { Filters } from '../types/Filters';
import { PagePurposes } from '../consts/enums/PagePurposes';
import { PlayersCs2Filters } from '../types/queryTypes/PlayersC2Filters';
import { PlayersValorantFilters } from '../types/queryTypes/PlayersValorantFilters';
import { TeamsCs2Filters } from '../types/queryTypes/TeamsCs2Filters';
import { TeamsValorantFilters } from '../types/queryTypes/TeamsValorantFilters';
import CommonInput from './UI/CommonInput';
import { CircularProgress } from '@mui/material';
import FilterBarSelect from './UI/FilterBarSelect';
import styled from 'styled-components';

interface FilterBarProps {
  filters: Filters;
  setFilters: (someFilters: Filters) => void;
  purpose: PagePurposes;
}

const inputWidth = 130;

const FilterBar: FC<FilterBarProps> = ({ filters, setFilters, purpose }) => {
  if (purpose === PagePurposes.PlayersCs2) {
    const currentFilters: PlayersCs2Filters = filters;
    console.log(currentFilters);
    return (
      <FilterBarContainer>
        {currentFilters ? (
          <>
            <FilterRow>
              <span>Игра:</span>
              <FilterBarSelect />
            </FilterRow>
            <FilterCell>
              <span>Возраст</span>

              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minAge as string}
                    onChange={(e) => setFilters({ ...currentFilters, minAge: e.target.value })}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                  />

                  <CommonInput
                    value={currentFilters.maxAge as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxAge: e.target.value })}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>
            <FilterCell>
              <span>ELO</span>
              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minEloValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, minEloValue: e.target.value })}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                  />

                  <CommonInput
                    value={currentFilters.maxEloValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxEloValue: e.target.value })}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>
            <FilterCell>
              <span>K/D</span>

              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minKdValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, minKdValue: e.target.value })}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                  />

                  <CommonInput
                    value={currentFilters.maxKdValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxKdValue: e.target.value })}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>
            <FilterCell>
              <span>HS</span>

              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minHsValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, minHsValue: e.target.value })}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                  />

                  <CommonInput
                    value={currentFilters.maxHsValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxHsValue: e.target.value })}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>
            <FilterCell>
              <span>Винрейт</span>

              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minWinrateValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, minWinrateValue: e.target.value })}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                  />
                  <CommonInput
                    value={currentFilters.maxWinrateValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxWinrateValue: e.target.value })}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }} //Добавить еще фильтров
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>
          </>
        ) : (
          <CircularProgress
            color='error'
            size={'50px'}
            sx={{
              zIndex: 3,
              position: 'absolute',
              inset: '0',
              margin: 'auto',
            }}
          />
        )}
      </FilterBarContainer>
    );
  }
  if (purpose === PagePurposes.PlayersValorant) {
    const currentFilters: PlayersValorantFilters = filters;

    return <div></div>;
  }
  if (purpose === PagePurposes.TeamsCs2) {
    const currentFilters: TeamsCs2Filters = filters;

    return <div></div>;
  }
  if (purpose === PagePurposes.TeamsValorant) {
    const currentFilters: TeamsValorantFilters = filters;

    return <div></div>;
  }
};

const DoubleInput = styled.div`
  display: flex;
  :nth-child(1) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 2px solid #565656;
  }
  column-gap: 1px;
  :nth-child(2) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 2px solid #565656;
  }
`;
const FilterBarContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px 20px;
  display: flex;
  row-gap: 20px;
  flex-direction: column;
  align-items: center;
  color: #d1cfcf;
`;

const FilterRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  margin-left: 20px;
  color: #d1cfcf;
  font-weight: 700;
  span {
    justify-self: flex-start;
  }
`;
const FilterCell = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  span {
    font-weight: 700;
  }
`;

export default FilterBar;
