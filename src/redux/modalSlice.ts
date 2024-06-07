import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalInitialState {
  regIsActive: boolean;
  loginIsActive: boolean;
  gameChoiceIsActive: boolean;
  chatIsActive: boolean;
  requestsIsActive: boolean;
  friendsInviteModalIsActive: boolean;
  invitedFriendsModalIsActive: boolean;
  teamInviteModalIsActive: boolean;
  requestToTeamModalIsActive: boolean;
  changeMemberRoleState: boolean;
  friendsModal: boolean;
}

const initialState: ModalInitialState = {
  regIsActive: false,
  loginIsActive: false,
  gameChoiceIsActive: false,
  chatIsActive: false,
  requestsIsActive: false,
  friendsInviteModalIsActive: false,
  invitedFriendsModalIsActive: false,
  teamInviteModalIsActive: false,
  requestToTeamModalIsActive: false,
  changeMemberRoleState: false,
  friendsModal: false,
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
    changeInvitedFriendsModalState(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        document.documentElement.style.overflowY = 'hidden';
      } else document.documentElement.style.overflowY = 'visible';

      state.invitedFriendsModalIsActive = action.payload;
    },

    changeTeamInviteModalState(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        document.documentElement.style.overflowY = 'hidden';
      } else document.documentElement.style.overflowY = 'visible';

      state.teamInviteModalIsActive = action.payload;
    },
    changeRequestToTeamModalState(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        document.documentElement.style.overflowY = 'hidden';
      } else document.documentElement.style.overflowY = 'visible';

      state.requestToTeamModalIsActive = action.payload;
    },

    changeMemberRoleModal(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        document.body.style.overflowY = 'hidden';
      } else document.body.style.overflowY = 'visible';

      state.changeMemberRoleState = action.payload;
    },

    changeFriendsModalState(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        document.body.style.overflowY = 'hidden';
      } else document.body.style.overflowY = 'visible';

      state.friendsModal = action.payload;
    },
  },
});

export const {
  changeLoginState,
  changeRegState,
  changeGameProfileState,
  changeChatState,
  changeReqsState,
  changeFriendsInviteModalState,
  changeInvitedFriendsModalState,
  changeTeamInviteModalState,
  changeRequestToTeamModalState,
  changeMemberRoleModal,
  changeFriendsModalState,
} = modalSlice.actions;

export default modalSlice.reducer;
