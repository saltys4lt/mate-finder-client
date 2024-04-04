import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalInitialState {
  regIsActive: boolean;
  loginIsActive: boolean;
  gameChoiceIsActive: boolean;
  chatIsActive: boolean;
}

const initialState: ModalInitialState = {
  regIsActive: false,
  loginIsActive: false,
  gameChoiceIsActive: false,
  chatIsActive: false,
};

const modalSlice = createSlice({
  name: 'usersReducer',
  initialState,

  reducers: {
    changeLoginState(state, action: PayloadAction<boolean>) {
      state.loginIsActive = action.payload;
    },
    changeRegState(state, action: PayloadAction<boolean>) {
      state.regIsActive = action.payload;
    },
    changeGameProfileState(state, action: PayloadAction<boolean>) {
      state.gameChoiceIsActive = action.payload;
    },
    changeChatState(state, action: PayloadAction<boolean>) {
      state.chatIsActive = action.payload;
    },
  },
});

export const { changeLoginState, changeRegState, changeGameProfileState, changeChatState } = modalSlice.actions;

export default modalSlice.reducer;
