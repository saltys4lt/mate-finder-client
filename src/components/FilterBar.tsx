import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Filters } from '../types/Filters';
import { PagePurposes } from '../consts/enums/PagePurposes';
import { PlayersCs2Filters } from '../types/queryTypes/PlayersC2Filters';

import { TeamsCs2Filters } from '../types/queryTypes/TeamsCs2Filters';

import CommonInput from './UI/CommonInput';
import { CircularProgress, FormControlLabel } from '@mui/material';

import styled from 'styled-components';
import { takeQueryFromUrl } from '../util/takeQueryFromUrl';
import { useQuery } from '../hooks/useQuery';
import { Radio, RadioGroup } from '@mui/material';
import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';
import Select from 'react-select';
import { CustomOption, CustomSingleValue, customStyles } from './UI/MapsSelect';
import Option from '../types/Option';
import { MultiValue } from 'react-select';
import { useSearchParams } from 'react-router-dom';
import RoleLable from './UI/RoleLable';
import { fetchMaps } from '../api/fetchMaps';

interface FilterBarProps {
  filters: Filters;
  setFilters: (someFilters: Filters) => void;
  purpose: PagePurposes;
}

const inputWidth = 130;

const FilterBar: FC<FilterBarProps> = ({ filters, setFilters, purpose }) => {
  const query = useQuery();
  const [searchParams] = useSearchParams();
  const [fetchedMaps, setFetchedMaps] = useState<Option[]>([]);
  const [selectedMaps, setSelectedMaps] = useState<MultiValue<Option>>([]);

  useEffect(() => {
    if (purpose === PagePurposes.PlayersCs2) {
      fetchMaps(setFetchedMaps);
      const maps: string[] = searchParams.getAll('maps');
      if (maps?.length !== 0) {
        setSelectedMaps(fetchedMaps.filter((map) => maps?.includes(map.value)));
      }
    }
  }, []);

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

    const handleSelectChange = (maps: MultiValue<Option>) => {
      setSelectedMaps(maps);
      setFilters({ ...currentFilters, maps: maps.map((value) => value.value) });
    };

    return (
      <FilterBarContainer>
        {currentFilters ? (
          <>
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
              <span>Пол :</span>
              <RadioGroup
                row
                defaultValue={'any'}
                sx={{ display: 'flex', flexDirection: 'column' }}
                value={currentFilters.gender ? currentFilters.gender : ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilters({ ...currentFilters, gender: e.target.value })}
              >
                <FormControlLabel
                  value='male'
                  control={
                    <Radio
                      sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: 'red',
                        },
                      }}
                    />
                  }
                  label='Мужской'
                />
                <FormControlLabel
                  value='female'
                  control={
                    <Radio
                      sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: 'red',
                        },
                      }}
                    />
                  }
                  label='Женский'
                />
                <FormControlLabel
                  value=''
                  control={
                    <Radio
                      sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: 'red',
                        },
                      }}
                    />
                  }
                  label='Любой'
                />
              </RadioGroup>
            </FilterCell>
            <FilterCell>
              <span>Рейтинг (еlo) :</span>
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
              <span>Кд :</span>

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
              <span>% Убийств в голову:</span>

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
              <span>Винрейт :</span>

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
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>

            <FilterCell>
              <span>Кол-во матчей :</span>

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
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>
            <FilterCell>
              <span>Роли :</span>
              <RolesContainer>
                {Cs2PlayerRoles.map((role, index) => (
                  <RoleCard key={role.id}>
                    <RoleCheckbox id={(index + 1).toString()} type='checkbox' value={role.name} onChange={(e) => changeRole(e)} />
                    <RoleLable role={role} htmlFor={(index + 1).toString()} className={roleState(role.name)}></RoleLable>
                  </RoleCard>
                ))}
              </RolesContainer>
            </FilterCell>
            <FilterCell>
              <span>Карты :</span>
              <Select
                maxMenuHeight={150}
                styles={{
                  ...customStyles,
                  control: (base: any) => ({
                    ...base,
                    marginTop: '20px',
                    background: '#181818',
                    boxShadow: '0',
                    borderColor: '#484848',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#808080',
                    },
                  }),
                }}
                options={fetchedMaps}
                isMulti
                value={selectedMaps}
                onChange={handleSelectChange}
                components={{
                  Option: CustomOption,
                  SingleValue: CustomSingleValue,
                }}
                placeholder='Выбор карт...'
              ></Select>
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

  if (purpose === PagePurposes.TeamsCs2) {
    const currentFilters: TeamsCs2Filters = filters;
    const queryParams: TeamsCs2Filters = takeQueryFromUrl(query);

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
            <FilterCell>
              <span>Количество участников :</span>
              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minMembersAmount as string}
                    onChange={(e) => setFilters({ ...currentFilters, minMembersAmount: e.target.value })}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                  />

                  <CommonInput
                    value={currentFilters.maxMembersAmount as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxMembersAmount: e.target.value } as TeamsCs2Filters)}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>
            <FilterCell>
              <span>Возраст участников :</span>
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
                    onChange={(e) => setFilters({ ...currentFilters, maxAge: e.target.value } as TeamsCs2Filters)}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>

            <FilterCell>
              <span>Рейтинг (elo) участников :</span>
              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minElo as string}
                    onChange={(e) => setFilters({ ...currentFilters, minElo: e.target.value } as TeamsCs2Filters)}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                    disabled={queryParams.category === 'recs'}
                  />

                  <CommonInput
                    value={currentFilters.maxElo as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxElo: e.target.value } as TeamsCs2Filters)}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                    disabled={queryParams.category === 'recs'}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>

            <FilterCell>
              <span>Винрейт участников:</span>

              <FilterRow>
                <DoubleInput>
                  <CommonInput
                    value={currentFilters.minWinrate as string}
                    onChange={(e) => setFilters({ ...currentFilters, minWinrate: e.target.value } as TeamsCs2Filters)}
                    placeholder='от'
                    style={{ maxWidth: inputWidth }}
                  />
                  <CommonInput
                    value={currentFilters.maxWinrate as string}
                    onChange={(e) => setFilters({ ...currentFilters, maxWinrate: e.target.value } as TeamsCs2Filters)}
                    placeholder='до'
                    style={{ maxWidth: inputWidth }}
                  />
                </DoubleInput>
              </FilterRow>
            </FilterCell>

            <FilterCell>
              <span>Свободные роли :</span>
              <RolesContainer>
                {Cs2PlayerRoles.map((role, index) => (
                  <RoleCard key={role.id}>
                    <RoleCheckbox id={(index + 1).toString()} type='checkbox' value={role.name} onChange={(e) => changeRole(e)} />
                    <RoleLable role={role} className={roleState(role.name)} htmlFor={(index + 1).toString()} />
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
};

const DoubleInput = styled.div`
  width: 100%;
  padding-right: 10px;
  display: flex;
  :nth-child(1) {
    width: 50%;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 2px solid #565656;
  }
  column-gap: 1px;
  :nth-child(2) {
    width: 50%;

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
  > span {
    font-weight: 700;
  }
`;

const RolesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

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

export default FilterBar;
