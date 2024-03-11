import { fetchPlayersParams } from '../types/fetchPlayersParams';
//переписать на точные значения в query
export const takeQueryFromUrl = (query: URLSearchParams): fetchPlayersParams => {
  const queryParams: Record<string, string> = {};
  for (const [param, value] of query.entries()) {
    queryParams[param] = value;
  }
  return queryParams;
};
