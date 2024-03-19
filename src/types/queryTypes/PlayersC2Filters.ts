export interface PlayersCs2Filters {
  category?: 'all' | 'recs';
  gender?: string;
  page?: string;
  searchQuery?: string;
  minAge?: string;
  maxAge?: string;
  maxEloValue?: string;
  minEloValue?: string;
  maxHsValue?: string;
  minHsValue?: string;
  maxKdValue?: string;
  minKdValue?: string;
  maxWinrateValue?: string;
  minWinrateValue?: string;
  roles?: string[];
  maps?: string[];
}
