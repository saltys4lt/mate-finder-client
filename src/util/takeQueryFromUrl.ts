//переписать на точные значения в query

import { Filters } from '../types/Filters';

export const takeQueryFromUrl = (query: URLSearchParams): Filters => {
  const queryParams: Record<string, string> = {};
  for (const [param, value] of query.entries()) {
    queryParams[param] = value;
  }
  return queryParams;
};
