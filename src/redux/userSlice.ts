import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';
import ClientUser from '../types/ClientUser';
import Cs2Data, { Map, Role } from '../types/Cs2Data';
import checkUserIsAuth from './userThunks/checkUserIsAuth';
import fetchUser from './userThunks/fetchUser';
import createUser from './userThunks/createUser';
import refillCs2Data from './cs2Thunks/refillCs2Data';
import updateCs2Data from './cs2Thunks/updateCs2Data';
import updateUser from './userThunks/updateUser';
import deleteCs2Data from './cs2Thunks/deleteCs2Data';
import defaultUserAvatar from '../assets/images/default-avatar.png';
import { FriendRequestWithAction } from '../types/friendRequest';
import fetchUserFriendsData from './userThunks/fetchUserFriendsData';
import { UserFriendsData } from '../types/UserFriendsData';
import Team from '../types/Team';
import createTeam from './teamThunks/createTeam';
import { TeamRequest } from '../types/TeamRequest';
import { Membership } from '../types/Membership';
import { Status } from '../types/Status';
import { ioSocket } from '../api/webSockets/socket';
import updateTeam from './teamThunks/updateTeam';
import fetchUpdatedUser from './userThunks/fetchUpdatedUser';
import kickPlayer from './teamThunks/kickPlayer';
import deleteTeam from './teamThunks/deleteTeam';
import updateRolesAndMaps from './cs2Thunks/updateRolesAndMaps';
interface UserState {
  user: ClientUser | null;
  isAuth: boolean;
  isAdmin: boolean;

  isGameCreationActive: 'cs2' | 'valorant' | null;
  createUserStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  fetchUserStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  checkUserStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  refillCs2DataStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  updateCs2DataStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  updateUserStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  deleteCs2Status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  createTeamStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  updateTeamStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  deleteTeamStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  updateRolesAndMapsStatus: 'idle' | 'pending' | 'fulfilled' | 'rejected';

  createUserError: string | null;
  fetchUserError: string | null;
  refillCs2DataError: string | null;
}

const initialState: UserState = {
  user: null,
  isAdmin: false,
  isAuth: false,
  isGameCreationActive: null,

  createUserStatus: 'idle',
  createUserError: null,

  fetchUserStatus: 'idle',
  fetchUserError: null,

  checkUserStatus: 'idle',

  refillCs2DataStatus: 'idle',
  refillCs2DataError: null,

  updateCs2DataStatus: 'idle',
  updateRolesAndMapsStatus: 'idle',
  updateUserStatus: 'idle',

  deleteCs2Status: 'idle',

  createTeamStatus: 'idle',
  updateTeamStatus: 'idle',
  deleteTeamStatus: 'idle',
};

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    resetUserStatus(state) {
      state.createUserStatus = 'idle';
      state.createUserError = null;
    },

    changeIsAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;

      state.fetchUserStatus = 'idle';
      if (!action.payload) {
        state.user = null;
      }
    },

    changeIsAdmin(state, action: PayloadAction<boolean>) {
      state.isAdmin = action.payload;

      state.fetchUserStatus = 'idle';
      if (!action.payload) {
        state.user = null;
      }
    },

    setPendingForCheck(state) {
      state.checkUserStatus = 'pending';
    },
    setGameCreationActive(state, action: PayloadAction<'cs2' | null>) {
      state.isGameCreationActive = action.payload;
    },
    setUpdateFaceitStatus(state, action) {
      state.updateCs2DataStatus = action.payload;
    },
    setUserFriends(state, action: PayloadAction<ClientUser>) {
      if (state.user) {
        state.user.friends.push(action.payload);
        const isUserReceived = state.user.receivedRequests.find((req) => req.fromUser.nickname === action.payload.nickname);
        if (isUserReceived) {
          state.user.receivedRequests = state.user.receivedRequests.filter((req) => req.fromUser.nickname !== action.payload.nickname);
        } else {
          state.user.sentRequests = state.user.sentRequests.filter((req) => req.toUser.nickname !== action.payload.nickname);
        }
      }
    },
    deleteFriend(state, action: PayloadAction<number>) {
      if (state.user) {
        state.user.friends = state.user.friends.filter((friend) => friend.id !== action.payload);
      }
    },

    removeFriendRequest(state, action: PayloadAction<FriendRequestWithAction>) {
      if (state.user) {
        const { req, denied } = action.payload;
        if (denied === 0) {
          if (state.user?.sentRequests) state.user.sentRequests = state.user?.sentRequests.filter((sReq) => sReq.id !== req.id);
        }
        if (denied === 1) {
          if (state.user?.receivedRequests) state.user.receivedRequests = state.user?.receivedRequests.filter((sReq) => sReq.id !== req.id);
        }
      }
    },
    setUserReceivedFriendRequests(state, action: PayloadAction<FriendRequestWithAction>) {
      if (state.user) {
        if (action.payload.denied === -1) {
          state.user.receivedRequests.push(action.payload.req);
        } else {
          const fr = action.payload.req;
          console.log();
          state.user = { ...state.user, receivedRequests: state.user.receivedRequests.filter((req) => req.fromUserId !== fr.fromUserId) };
        }
      }
    },
    setUserSentFriendRequests(state, action: PayloadAction<FriendRequestWithAction>) {
      if (state.user) {
        if (action.payload.denied === -1) {
          state.user.sentRequests.push(action.payload.req);
        } else {
          const fr = action.payload.req;

          state.user = { ...state.user, sentRequests: state.user.sentRequests.filter((req) => req.toUserId !== fr.toUserId) };
        }
      }
    },

    resetStatus(state, action: PayloadAction<Status>) {
      state[action.payload] = 'idle';
    },
    addTeamRequest(state, action: PayloadAction<TeamRequest>) {
      if (state.user) {
        if (state.user.teams?.find((team) => team.id === action.payload.teamId)) {
          state.user.teams = state.user.teams?.map((team) =>
            team.id === action.payload.teamId ? { ...team, teamRequests: [...team.teamRequests, action.payload] } : team,
          );
        } else state.user.requestsToTeam.push(action.payload);
      }
    },
    joinTeam(state, action: PayloadAction<Membership>) {
      if (state.user) {
        if (state.user.teams?.find((team) => team.id === action.payload.teamId)) {
          state.user.teams = state.user.teams?.map((team) =>
            team.id === action.payload.teamId
              ? {
                  ...team,
                  teamRequests: team.teamRequests.filter((req) => req.teamId !== action.payload.teamId),
                  members: [...team.members, action.payload],
                }
              : team,
          );
        } else {
          state.user.memberOf.push(action.payload);
          state.user.requestsToTeam = state.user.requestsToTeam.filter((req) => req.teamId !== action.payload.teamId);
          if (action.payload.team.chat) {
            ioSocket.emit('join', action.payload.team.chat.roomId);
          }
        }
      }
    },
    removeTeamRequest(state, action: PayloadAction<TeamRequest>) {
      if (state.user) {
        if (state.user.teams?.find((team) => team.id === action.payload.teamId)) {
          state.user.teams = state.user.teams?.map((team) =>
            team.id === action.payload.teamId
              ? { ...team, teamRequests: team.teamRequests.filter((req) => req.id !== action.payload.id) }
              : team,
          );
        } else state.user.requestsToTeam = state.user.requestsToTeam.filter((req) => req.id !== action.payload.id);
      }
    },
    cancelTeamRequest(state, action: PayloadAction<{ req: TeamRequest; toMyTeam: boolean }>) {
      if (state.user) {
        if (action.payload.toMyTeam) {
          state.user.teams = state.user.teams.map((team) =>
            action.payload.req.teamId === team.id
              ? {
                  ...team,
                  teamRequests: team.teamRequests.filter((req) => req.id !== action.payload.req.id),
                }
              : team,
          );
        } else {
          state.user.requestsToTeam = state.user.requestsToTeam.filter((req) => req.id !== action.payload.req.id);
        }
      }
    },
    leaveTeam(state, action: PayloadAction<{ team: Team; userId: number; byOwner: boolean }>) {
      if (state.user) {
        const candidate = state.user.teams[0]?.members.find((member) => member.user.id === action.payload.userId);
        if (candidate) {
          console.log(candidate);
          state.user.teams = state.user.teams.map((team) =>
            action.payload.team.id === team.id
              ? {
                  ...team,
                  members: team.members.filter((member) => member.user.id !== action.payload.userId),
                }
              : team,
          );
        } else {
          state.user.memberOf = state.user.memberOf.filter((memberOf) => memberOf.teamId !== action.payload.team.id);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.fetchUserStatus = 'pending';
    });
    builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<ClientUser>) => {
      state.fetchUserStatus = 'fulfilled';
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-start',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'success',
        title: 'Успешный вход!',
        text: `Добро пожаловать, ${action.payload.nickname}`,
      });
      if (action.payload) {
        state.checkUserStatus = 'fulfilled';
        const userAvatar = action.payload.user_avatar ? action.payload.user_avatar : defaultUserAvatar;
        state.user = { ...action.payload, user_avatar: userAvatar };
        state.isAuth = true;
      }
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.fetchUserStatus = 'rejected';
      state.fetchUserError = action.payload as string;
      Swal.fire({
        icon: 'error',
        title: 'Ошибка входа',
        text: state.fetchUserError,
        showConfirmButton: true,
        confirmButtonText: 'Понял',
      });
    });

    builder.addCase(createUser.pending, (state) => {
      state.createUserStatus = 'pending';
    });
    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.createUserStatus = 'fulfilled';
      Swal.fire({
        icon: 'success',
        title: `Успех!`,
        text: `Пользователь ${action.payload} создан`,
        showConfirmButton: false,
        timer: 2000,
      });
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.createUserStatus = 'rejected';
      state.createUserError = action.payload as string;

      Swal.fire({
        icon: 'error',
        title: 'Ошибка регистрации!',
        text: state.createUserError,
        showConfirmButton: true,
        timer: 3000,
        confirmButtonText: 'Get It',
      });
    });

    builder.addCase(checkUserIsAuth.pending, (state) => {
      state.checkUserStatus = 'pending';
    });
    builder.addCase(checkUserIsAuth.fulfilled, (state, action: PayloadAction<ClientUser | undefined>) => {
      if (action.payload) {
        state.checkUserStatus = 'fulfilled';
        const userAvatar = action.payload.user_avatar ? action.payload.user_avatar : defaultUserAvatar;
        state.user = { ...action.payload, user_avatar: userAvatar };
        state.isAuth = true;
      }
    });
    builder.addCase(checkUserIsAuth.rejected, (state) => {
      state.checkUserStatus = 'rejected';
    });
    builder.addCase(fetchUpdatedUser.fulfilled, (state, action: PayloadAction<ClientUser | undefined>) => {
      if (action.payload) state.user = { ...action.payload };
    });

    builder.addCase(kickPlayer.fulfilled, (state, action: PayloadAction<Membership>) => {
      if (state.user?.teams) {
        state.user.teams = state.user?.teams.map((team) =>
          team.id === action.payload.teamId ? { ...team, members: team.members.filter((member) => member.id !== action.payload.id) } : team,
        );
      }
    });

    builder.addCase(deleteTeam.fulfilled, (state, action: PayloadAction<number>) => {
      if (state.user && action.payload) {
        state.user.teams = [];
        state.deleteTeamStatus = 'fulfilled';
      }
    });

    //cs2
    builder.addCase(refillCs2Data.pending, (state) => {
      state.refillCs2DataStatus = 'pending';
    });
    builder.addCase(refillCs2Data.fulfilled, (state, action: PayloadAction<Cs2Data>) => {
      state.refillCs2DataStatus = 'fulfilled';
      console.log(action.payload);
      if (state.user?.cs2_data) {
        state.user.cs2_data = action.payload;
        state.fetchUserStatus = 'fulfilled';
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Ура!',
          text: `Ваш игровой профиль для Counter-Strike 2 успешно создан!`,
        });
      }
    });

    builder.addCase(refillCs2Data.rejected, (state, action) => {
      state.refillCs2DataStatus = 'rejected';
      state.refillCs2DataError = action.payload as string;
    });

    //updateCs2data
    builder.addCase(updateCs2Data.pending, (state) => {
      state.updateCs2DataStatus = 'pending';
    });

    builder.addCase(updateCs2Data.fulfilled, (state, action: PayloadAction<Cs2Data>) => {
      state.updateCs2DataStatus = 'fulfilled';
      if (state.user) {
        const roles = state.user.cs2_data?.roles;
        const maps = state.user.cs2_data?.maps;
        state.user = {
          ...state.user,
          cs2_data: (state.user.cs2_data = { ...action.payload, roles: roles as Role[], maps: maps as Map[] }),
        };
      }
    });

    builder.addCase(updateRolesAndMaps.pending, (state) => {
      state.updateRolesAndMapsStatus = 'pending';
    });
    builder.addCase(updateRolesAndMaps.fulfilled, (state, action: PayloadAction<Cs2Data>) => {
      state.updateRolesAndMapsStatus = 'fulfilled';

      if (state.user?.cs2_data) {
        state.user.cs2_data = action.payload;
        state.fetchUserStatus = 'fulfilled';
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'success',
          text: `Ваш игровой профиль для Counter-Strike 2 обновлен!`,
        });
      }
    });

    builder.addCase(updateCs2Data.rejected, (state) => {
      state.updateCs2DataStatus = 'rejected';
    });

    //update user data
    builder.addCase(updateUser.pending, (state) => {
      state.updateUserStatus = 'pending';
    });
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<ClientUser>) => {
      state.updateUserStatus = 'fulfilled';
      state.user = { ...state.user, ...action.payload };
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.updateUserStatus = 'rejected';
    });

    //delete cs2data
    builder.addCase(deleteCs2Data.pending, (state) => {
      state.updateUserStatus = 'pending';
    });

    builder.addCase(deleteCs2Data.fulfilled, (state, action) => {
      state.deleteCs2Status = 'fulfilled';
      console.log(action.payload);
      state.user = { ...state.user, cs2_data: null } as ClientUser;
    });
    builder.addCase(deleteCs2Data.rejected, (state) => {
      state.updateUserStatus = 'rejected';
    });

    //user friends
    builder.addCase(fetchUserFriendsData.fulfilled, (state, action: PayloadAction<UserFriendsData>) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
        state.user.receivedRequests = action.payload.receivedRequests;
        state.user.sentRequests = action.payload.sentRequests;
      }
    });

    //teams
    builder.addCase(createTeam.pending, (state) => {
      state.createTeamStatus = 'pending';
    });
    builder.addCase(createTeam.fulfilled, (state, action: PayloadAction<Team>) => {
      if (state.user) {
        state.createTeamStatus = 'fulfilled';
        state.user.teams?.push(action.payload);
        if (action.payload.chat) ioSocket.emit('join', action.payload.chat.roomId as string);
      }
    });

    builder.addCase(updateTeam.fulfilled, (state, action: PayloadAction<Team>) => {
      if (state.user) {
        state.user.teams = state.user.teams.map((team) => (team.id === action.payload.id ? action.payload : team));

        state.updateTeamStatus = 'fulfilled';
      }
    });
  },
});

export const {
  resetUserStatus,
  changeIsAuth,
  changeIsAdmin,
  setPendingForCheck,
  setGameCreationActive,
  setUpdateFaceitStatus,
  setUserSentFriendRequests,
  setUserFriends,
  setUserReceivedFriendRequests,
  addTeamRequest,
  joinTeam,
  removeTeamRequest,
  resetStatus,
  cancelTeamRequest,
  leaveTeam,
  removeFriendRequest,
  deleteFriend,
} = userSlice.actions;

export default userSlice.reducer;
