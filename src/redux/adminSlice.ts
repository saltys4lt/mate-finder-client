import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import fetchPlayers from './adminThunks/fetchPlayers';
import { PlayersWithPages } from '../types/PlayersWithPages';
import { AdminPlayer } from '../types/AdminPlayer';
import fetchAllMaps from './adminThunks/fetchAllMaps';
import createMap from './adminThunks/createMap';
import updateMap from './adminThunks/updateMap';
import deleteMap from './adminThunks/deleteMap';
interface AdminState {
  player: AdminPlayer | null;
  players: AdminPlayer[];
  maps: any[];
  sort: 'asc' | 'desc';
  filter: string;
  cs2_data: boolean;
  desc: boolean;
  user_avatar: boolean;
  fetchPlayerByNameStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  fetchPlayerByNameError: null | string;
  gender: 'male' | 'female' | '';
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  searchFilter: string;
}

const initialState: AdminState = {
  maps: [],
  player: null,
  players: [],
  fetchPlayerByNameStatus: 'idle',
  fetchPlayerByNameError: null,
  sort: 'asc',
  filter: 'id',
  cs2_data: false,
  desc: false,
  user_avatar: false,
  gender: '',
  currentPage: 1,
  totalPages: 5,
  searchQuery: '',
  searchFilter: 'nickname',
};
const adminSlice = createSlice({
  name: 'adminReducer',
  initialState,
  reducers: {
    setPlayer(state, action: PayloadAction<null | AdminPlayer>) {
      state.player = action.payload;
    },
    setPlayerError(state, action: PayloadAction<null | string>) {
      state.fetchPlayerByNameError = action.payload;
      if (action.payload === null) {
        state.fetchPlayerByNameStatus = 'idle';
      }
    },
    setSort(state, action: PayloadAction<'asc' | 'desc'>) {
      state.sort = action.payload;
    },
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
    setCs2_data(state, action: PayloadAction<boolean>) {
      state.cs2_data = action.payload;
    },
    setDesc(state, action: PayloadAction<boolean>) {
      state.desc = action.payload;
    },
    setUser_Avatar(state, action: PayloadAction<boolean>) {
      state.user_avatar = action.payload;
    },
    setGender(state, action: PayloadAction<'male' | 'female' | ''>) {
      state.gender = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.searchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<PlayersWithPages>) => {
      state.players = action.payload.players;
      state.totalPages = action.payload.totalPages;
      if (action.payload.totalPages === 1) {
        state.currentPage = 1;
      }
    });

    builder.addCase(fetchAllMaps.fulfilled, (state, action: PayloadAction<any>) => {
      state.maps = action.payload;
    });
    builder.addCase(createMap.fulfilled, (state, action: PayloadAction<any>) => {
      state.maps = action.payload;
    });
    builder.addCase(updateMap.fulfilled, (state, action: PayloadAction<any>) => {
      state.maps = action.payload;
    });
    builder.addCase(deleteMap.fulfilled, (state, action: PayloadAction<any>) => {
      state.maps = action.payload;
    });
  },
});

export const {
  setPlayer,
  setPlayerError,
  setSort,
  setCs2_data,
  setDesc,
  setFilter,
  setUser_Avatar,
  setGender,
  setCurrentPage,
  setSearchFilter,
  setSearchQuery,
} = adminSlice.actions;

export default adminSlice.reducer;
