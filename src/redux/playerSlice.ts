import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import Player from '../types/Player';
import fetchPlayerByName from './playerThunks/fetchPlayerByName';
import fetchPlayers from './playerThunks/fetchPlayers';
import fetchTopPlayers from './playerThunks/fetchTopPlayers';
interface PlayerState {
  player: Player | null;
  players: Player[];
  topPlayers: Player[];

  pages: number;
  fetchPlayerByNameStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  fetchPlayerByNameError: null | string;

  fetchPlayersStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  fetchTopPlayersStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';

  fetchPlayersError: null | string;
}

const initialState: PlayerState = {
  player: null,
  players: [],
  topPlayers: [],
  pages: 1,
  fetchPlayerByNameStatus: 'idle',
  fetchPlayerByNameError: null,
  fetchPlayersStatus: 'idle',
  fetchPlayersError: null,
  fetchTopPlayersStatus: 'idle',
};
const playerSlice = createSlice({
  name: 'usersReducer',
  initialState,
  reducers: {
    setPlayer(state, action: PayloadAction<null | Player>) {
      state.player = action.payload;
    },
    setPlayerError(state, action: PayloadAction<null | string>) {
      state.fetchPlayerByNameError = action.payload;
      if (action.payload === null) {
        state.fetchPlayerByNameStatus = 'idle';
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPlayerByName.pending, (state) => {
      state.fetchPlayerByNameStatus = 'pending';
    });
    builder.addCase(fetchPlayerByName.fulfilled, (state, action: PayloadAction<Player>) => {
      state.fetchPlayerByNameStatus = 'fulfilled';
      state.player = action.payload;
    });
    builder.addCase(fetchPlayerByName.rejected, (state, action) => {
      state.fetchPlayerByNameStatus = 'rejected';
      state.fetchPlayerByNameError = action.payload as string;
    });

    builder.addCase(fetchPlayers.pending, (state) => {
      state.fetchPlayersStatus = 'pending';
    });
    builder.addCase(fetchPlayers.fulfilled, (state, action: PayloadAction<{ players: Player[]; pages: number }>) => {
      state.fetchPlayersStatus = 'fulfilled';
      state.fetchPlayerByNameError = null;
      const { pages, players } = action.payload;
      state.pages = pages;

      state.players = players;
    });
    builder.addCase(fetchPlayers.rejected, (state, action) => {
      state.fetchPlayersStatus = 'rejected';
      state.fetchPlayersError = action.payload as string;
    });
    builder.addCase(fetchTopPlayers.pending, (state) => {
      state.fetchTopPlayersStatus = 'pending';
    });

    builder.addCase(fetchTopPlayers.fulfilled, (state, action: PayloadAction<Player[]>) => {
      state.fetchTopPlayersStatus = 'fulfilled';
      state.topPlayers = action.payload;
    });
  },
});

export const { setPlayer, setPlayerError } = playerSlice.actions;

export default playerSlice.reducer;
