import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalInitialState {
  regIsActive: boolean;
  loginIsActive: boolean;
  gameChoiceIsActive: boolean;
  chatIsActive: boolean;
  requestsIsActive: boolean;
}

const initialState: ModalInitialState = {
  regIsActive: false,
  loginIsActive: false,
  gameChoiceIsActive: false,
  chatIsActive: false,
  requestsIsActive: false,
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
    changeReqsState(state, action: PayloadAction<boolean>) {
      state.requestsIsActive = action.payload;
    },
  },
});

export const { changeLoginState, changeRegState, changeGameProfileState, changeChatState, changeReqsState } = modalSlice.actions;

export default modalSlice.reducer;
