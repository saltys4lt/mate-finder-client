import { FC } from 'react';
import { Filters } from '../types/Filters';
import { FilterPurposes } from '../consts/enums/FilterPurposes';
import { PlayersCs2Filters } from '../types/queryTypes/PlayersC2Filters';
import { PlayersValorantFilters } from '../types/queryTypes/PlayersValorantFilters';
import { TeamsCs2Filters } from '../types/queryTypes/TeamsCs2Filters';
import { TeamsValorantFilters } from '../types/queryTypes/TeamsValorantFilters';

interface FilterBarProps {
  filters: Filters;
  setFilters: (someFilters: Filters) => void;
  purpose: FilterPurposes;
}

const FilterBar: FC<FilterBarProps> = ({ filters, setFilters, purpose }) => {
  if (purpose === FilterPurposes.PlayersCs2) {
    const currentFilters: PlayersCs2Filters = filters;

    return <div></div>;
  }
  if (purpose === FilterPurposes.PlayersValorant) {
    const currentFilters: PlayersValorantFilters = filters;

    return <div></div>;
  }
  if (purpose === FilterPurposes.TeamsCs2) {
    const currentFilters: TeamsCs2Filters = filters;

    return <div></div>;
  }
  if (purpose === FilterPurposes.TeamsValorant) {
    const currentFilters: TeamsValorantFilters = filters;

    return <div></div>;
  }
};

export default FilterBar;
