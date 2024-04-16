import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalInitialState {
  regIsActive: boolean;
  loginIsActive: boolean;
  gameChoiceIsActive: boolean;
  chatIsActive: boolean;
  requestsIsActive: boolean;
  friendsInviteModalIsActive: boolean;
}

const initialState: ModalInitialState = {
  regIsActive: false,
  loginIsActive: false,
  gameChoiceIsActive: false,
  chatIsActive: false,
  requestsIsActive: false,
  friendsInviteModalIsActive: false,
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
    changeFriendsInviteModalState(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        document.documentElement.style.overflowY = 'hidden';
      } else document.documentElement.style.overflowY = 'visible';

      state.friendsInviteModalIsActive = action.payload;
    },
  },
});

export const { changeLoginState, changeRegState, changeGameProfileState, changeChatState, changeReqsState, changeFriendsInviteModalState } =
  modalSlice.actions;

export default modalSlice.reducer;
