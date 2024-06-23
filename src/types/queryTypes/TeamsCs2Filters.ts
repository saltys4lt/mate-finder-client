export interface TeamsCs2Filters {
  category?: 'all' | 'recs';
  page?: string;
  searchQuery?: string;
  minAge?: string;
  maxAge?: string;
  maxElo?: string;
  minElo?: string;
  maxWinrate?: string;
  minWinrate?: string;
  roles?: string[];
  maxMembersAmount?: string;
  minMembersAmount?: string;
}
