import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Filters } from '../types/Filters';
import { PagePurposes } from '../consts/enums/PagePurposes';
import { PlayersCs2Filters } from '../types/queryTypes/PlayersC2Filters';
import { PlayersValorantFilters } from '../types/queryTypes/PlayersValorantFilters';
import { TeamsCs2Filters } from '../types/queryTypes/TeamsCs2Filters';
import { TeamsValorantFilters } from '../types/queryTypes/TeamsValorantFilters';
import CommonInput from './UI/CommonInput';
import { CircularProgress, FormControlLabel } from '@mui/material';
import FilterBarSelect from './UI/FilterBarSelect';
import styled from 'styled-components';
import { takeQueryFromUrl } from '../util/takeQueryFromUrl';
import { useQuery } from '../hooks/useQuery';
import { Radio, RadioGroup } from '@mui/material';
import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';

interface FilterBarProps {
  filters: Filters;
  setFilters: (someFilters: Filters) => void;
  purpose: PagePurposes;
}

const inputWidth = 130;

const FilterBar: FC<FilterBarProps> = ({ filters, setFilters, purpose }) => {
  const query = useQuery();

  if (purpose === PagePurposes.PlayersCs2) {
    const queryParams: PlayersCs2Filters = takeQueryFromUrl(query);

    const currentFilters: PlayersCs2Filters = filters;

    const roleState = (role: string) => {
      if (currentFilters.roles?.includes(role)) return 'active';
      else return '';
    };
    const changeRole = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!currentFilters.roles?.includes(e.target.value))
        setFilters({ ...currentFilters, roles: [...(currentFilters.roles as string[]), e.target.value] });
      else setFilters({ ...currentFilters, roles: [...currentFilters.roles.filter((role) => role !== e.target.value)] });
    };

    return (
      <FilterBarContainer>
        {currentFilters ? (
          <>
            <FilterRow>
              <span>Игра:</span>
              <FilterBarSelect />
            </FilterRow>
            <FilterCell>
              <span>Возраст :</span>
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
              <span>Пол</span>
              <RadioGroup
                row
                defaultValue={'any'}
                sx={{ display: 'flex', flexDirection: 'column' }}
                value={currentFilters.gender ? currentFilters.gender : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters({ ...currentFilters, gender: e.target.value })}
              >
                <FormControlLabel value='male' control={<Radio color='error' />} label='Мужской' />
                <FormControlLabel value='female' control={<Radio color='error' />} label='Женский' />
                <FormControlLabel value='' control={<Radio color='error' />} label='Любой' />
              </RadioGroup>
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
                    disabled={queryParams.category === 'recs'}
                  />

                  <CommonInput
                    value={currentFilters.maxEloValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxEloValue: e.target.value })}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                    disabled={queryParams.category === 'recs'}
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
                    disabled={queryParams.category === 'recs'}
                  />

                  <CommonInput
                    value={currentFilters.maxKdValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxKdValue: e.target.value })}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                    disabled={queryParams.category === 'recs'}
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

            <FilterCell>
              <span>Кол-во матчей</span>

              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minMatchesValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, minMatchesValue: e.target.value })}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                  />
                  <CommonInput
                    value={currentFilters.maxMatchesValue as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxMatchesValue: e.target.value })}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }} //Добавить еще фильтров
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>
            <FilterCell>
              <span>Роли</span>
              <RolesContainer>
                {Cs2PlayerRoles.map((role, index) => (
                  <RoleCard key={role.id}>
                    <RoleCheckbox id={(index + 1).toString()} type='checkbox' value={role.name} onChange={(e) => changeRole(e)} />
                    <RoleLabel className={roleState(role.name)} htmlFor={(index + 1).toString()}>
                      {role.name}
                    </RoleLabel>
                  </RoleCard>
                ))}
              </RolesContainer>
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

const RolesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const RoleCard = styled.div`
  margin-top: 15px;

  display: flex;
  justify-content: center;
`;

const RoleCheckbox = styled.input`
  display: none;
`;

const RoleLabel = styled.label`
  border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;
  display: block;
  width: 130px;
  text-align: center;
  font-size: 16px;
  color: #d1cfcf;
  &:hover {
    border-color: #fff;
    cursor: pointer;
  }

  &.active {
    border-color: #fff;
    transform: scale(1.03);
  }

  &.focus {
    opacity: 0.3;
    border: 2px solid #565656;
    &:hover {
      cursor: auto;
    }
  }

  user-select: none;
  &:hover {
    cursor: pointer;
  }
`;

export default FilterBar;
