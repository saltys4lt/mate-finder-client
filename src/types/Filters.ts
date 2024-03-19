import { PlayersCs2Filters } from './queryTypes/PlayersC2Filters';
import { PlayersValorantFilters } from './queryTypes/PlayersValorantFilters';
import { TeamsCs2Filters } from './queryTypes/TeamsCs2Filters';
import { TeamsValorantFilters } from './queryTypes/TeamsValorantFilters';

export type Filters = PlayersCs2Filters | PlayersValorantFilters | TeamsCs2Filters | TeamsValorantFilters;
