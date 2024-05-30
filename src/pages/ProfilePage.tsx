import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState, useAppDispatch } from '../redux';
import { dateToUserAge } from '../util/dateToUserAge';
import Container from '../components/Container';
import CommonButton from '../components/UI/CommonButton';
import MapsImages from '../consts/MapsImages';
import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import fetchPlayerByName from '../redux/playerThunks/fetchPlayerByName';
import ClientUser from '../types/ClientUser';
import Player from '../types/Player';
import { setPlayer, setPlayerError } from '../redux/playerSlice';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import updateCs2Data from '../redux/cs2Thunks/updateCs2Data';
import { CircularProgress } from '@mui/material';
import LoaderBackground from '../components/UI/LoaderBackground';
import copyCurrentUrl from '../util/copyCurrentUrl';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import updateUser from '../redux/userThunks/updateUser';
import UpdatedUserData from '../types/UpdatedUserData';
import Swal from 'sweetalert2';
import cancelReqIcon from '../assets/images/cancel-invite.png';
import deleteCs2Data from '../redux/cs2Thunks/deleteCs2Data';
import { changeChatState, changeGameProfileState, changeTeamInviteModalState } from '../redux/modalSlice';
import defaultUserAvatar from '../assets/images/default-avatar.png';
import editIcon from '../assets/images/edit.png';
import linkIcon from '../assets/images/link.png';
import groupInviteIcon from '../assets/images/group-invite.png';
import closeCross from '../assets/images/close-cross.png';
import sendedFriendReq from '../assets/images/sended-friend-req.png';
import inFriendsIcon from '../assets/images/in-friends-icon.png';
import removeFriendIcon from '../assets/images/remove-player.png';

import confirmEditIcon from '../assets/images/confirm-edit.png';
import editProfileIcon from '../assets/images/edit-profile.png';
import FriendsIcon from '../assets/images/friends.png';
import addFriendsIcon from '../assets/images/add-friend.png';
import sendMessageIcon from '../assets/images/send-message.png';
import cs2ProfilePicture from '../assets/images/cs2-profile-pic.jpeg';
import valorantProfilePicture from '../assets/images/valorant-profile-pic.jpg';
import dropDownArrow from '../assets/images/drop-down-arrow.png';
import headerBg from '../assets/images/profile-bg.png';
import { setCurrentChat } from '../redux/chatSlice';
import { Chat } from '../types/Chat';
import { sendFriendRequest } from '../api/friendsRequests/sendFriendRequest';
import inGroupIcon from '../assets/images/in-group-icon.png';
import { useTransition, animated } from '@react-spring/web';

import ReactDOMServer from 'react-dom/server';
import TeamInviteModal from '../components/TeamInviteModal';
import { cancelFriendRequest } from '../api/friendsRequests/cancelFriendRequest';
import { friendRequestAnswer } from '../api/friendsRequests/friendRequestAnswer';
import { deleteFromFriends } from '../api/friendsRequests/deleteFromFriends';
const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const nickname = useParams().nickname;
  const user = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const player = useSelector((root: RootState) => root.playerReducer.player) as Player;

  const playerError = useSelector((root: RootState) => root.playerReducer.fetchPlayerByNameError);
  const updateFaceitStatus = useSelector((root: RootState) => root.userReducer.updateCs2DataStatus);
  const deleteCs2Status = useSelector((root: RootState) => root.userReducer.deleteCs2Status);
  const chats = useSelector((root: RootState) => root.chatReducer.chats);

  const [profileUser, setProfileUser] = useState<ClientUser | Player | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [urlTextCopied, setUrlTextCopied] = useState<boolean>(false);
  const [filename, setFileName] = useState<string>('');
  const [avatarIsLoading, setAvatarIsLoading] = useState<boolean>(false);
  const [showRemoveFriend, setShowRemoveFriend] = useState<boolean>(false);
  const [updatedUserData, setUpdatedUserData] = useState<UpdatedUserData>({
    description: profileUser?.description ?? '',
    user_avatar: profileUser?.user_avatar ?? '',
  });
  const transitions = useTransition(showRemoveFriend, {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    enter: { transform: 'translateY(0)', opacity: 1 },
    leave: { transform: 'translateY(-20px)', opacity: 0 },
    config: { tension: 220, friction: 20 },
  });
  useEffect(() => {
    if (user?.nickname === nickname) {
      setProfileUser(user);
    } else {
      if (player) {
        setProfileUser(player);
      } else dispatch(fetchPlayerByName(nickname as string));
    }

    return () => {
      if (player) {
        dispatch(setPlayer(null));
        dispatch(setPlayerError(null));
      }
    };
  }, [nickname, player, user]);

  useEffect(() => {
    if (updateFaceitStatus === 'fulfilled') {
      setProfileUser(user);
    }
  }, [updateFaceitStatus]);

  if (playerError) {
    dispatch(setPlayer(null));
    dispatch(setPlayerError(null));
    navigate('/');
  }

  useEffect(() => {
    if (urlTextCopied)
      setTimeout(() => {
        setUrlTextCopied(false);
      }, 2000);
  }, [urlTextCopied]);

  const handleUpdateFaceitData = (steamId: string) => {
    dispatch(updateCs2Data(steamId));
  };

  if (!profileUser) {
    return <Loader />;
  }

  const handleTeamInvite = () => {
    if (user.teams?.length === 0) {
      const NoTeamAlert = () => {
        return (
          <div style={{ textAlign: 'center' }}>
            <h3>У вас нет своей команды :&#40;</h3>
            <p>Но вы можете создать ее :D</p>
          </div>
        );
      };
      Swal.fire({
        html: ReactDOMServer.renderToString(<NoTeamAlert />),
        confirmButtonText: 'Создать',
        showCancelButton: true,
        cancelButtonText: 'Отмена',
      }).then((res) => {
        if (res.isConfirmed) {
          navigate('/team-creator');
        }
      });
    } else {
      dispatch(changeTeamInviteModalState(true));
    }
  };

  const cancelEdit = async () => {
    setEditMode(false);
    if (updatedUserData.user_avatar) {
      if (filename) {
        const storageRef = ref(storage, `avatars/${filename}`);

        await deleteObject(storageRef);
      }
    }
    setFileName('');
    setUpdatedUserData({
      description: user?.description ? user?.description : '',
      user_avatar: user?.user_avatar ? user?.user_avatar : '',
    });
  };
  const confirmEdit = async () => {
    await dispatch(updateUser(updatedUserData));
    setEditMode(false);
  };
  const openFileExplorer = () => {
    document.getElementById('file__input')?.click();
  };

  const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setAvatarIsLoading(true);
    const avatar = e.target.files[0];
    const storageRef = ref(storage, `avatars/${avatar.name}`);
    await uploadBytes(storageRef, avatar).then(() => {
      getDownloadURL(storageRef).then((url: string) => {
        setFileName(avatar.name);
        setUpdatedUserData({ user_avatar: url, description: updatedUserData.description });
      });
    });
    setAvatarIsLoading(false);
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedUserData({ ...updatedUserData, description: e.target.value });
  };

  const handleDeleteCs2data = () => {
    Swal.fire({
      title: 'Уверены?',
      text: 'Вам предеться снова регистрировать игровой профиль, чтобы открыть основные функции для этой игры!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#a4a4a4',
      confirmButtonText: 'Подтвердить',
      cancelButtonText: 'Отмена',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCs2Data());
      }
    });
  };
  const handleChatOpen = () => {
    dispatch(changeChatState(true));

    const openedChat = {
      roomId: user.id.toString() + player.id.toString(),
      members: [
        {
          user_avatar: player.user_avatar as string,
          nickname: player.nickname,
          id: player.id,
        },
        {
          avatar: user.user_avatar,
          nickname: user.nickname,
          id: user.id,
        },
      ],
      messages: [],
    } as Chat;

    const chat: Chat | undefined = chats?.find(
      (chat) =>
        chat.members.find((member) => !chat.team && member.id === user.id) && chat.members.find((member) => member.id === player.id),
    );
    if (chat) {
      dispatch(setCurrentChat(chat));
    } else dispatch(setCurrentChat(openedChat));
  };
  const sendRequest = (playerId: number) => {
    sendFriendRequest({ fromUserId: user.id, toUserId: playerId });
  };

  const profileAvatar = player
    ? profileUser.user_avatar
      ? profileUser.user_avatar
      : defaultUserAvatar
    : updatedUserData.user_avatar
      ? updatedUserData.user_avatar
      : profileUser?.user_avatar;

  return (
    <>
      <Modal />
      {player && user.teams.length > 0 && <TeamInviteModal candidate={player} />}
      <ProfileHeader>
        <Container>
          {!profileUser ? (
            <></>
          ) : (
            <>
              <MainDataContainer>
                <ProfileAvatarContainer>
                  <ProfileAvatar $avatarIsLoading={avatarIsLoading} src={profileAvatar} alt='' />
                  {editMode && (
                    <>
                      <ChangeAvatarButton onClick={openFileExplorer}>
                        <ChangeAvatarButtonIcon src={editIcon} alt='' />
                      </ChangeAvatarButton>
                      <input
                        style={{ display: 'none' }}
                        id='file__input'
                        className='file__upload__input'
                        type='file'
                        accept='image/png, image/jpeg'
                        onChange={(e) => {
                          uploadAvatar(e);
                        }}
                      />
                    </>
                  )}
                  {avatarIsLoading && (
                    <CircularProgress
                      color='error'
                      size={'50px'}
                      sx={{
                        zIndex: 3,
                        position: 'absolute',
                        inset: '0',
                        margin: 'auto',
                      }}
                    />
                  )}
                </ProfileAvatarContainer>
                <UserDataContainer>
                  <UserData>
                    <UserNickname>
                      {profileUser?.nickname}
                      <UserGender>, Пол: {profileUser?.gender === 'female' ? 'Женский' : 'Мужской'}</UserGender>
                    </UserNickname>
                    <UserAge>Возраст: {dateToUserAge(profileUser?.birthday as string)}</UserAge>

                    <UserDataButtons>
                      <CommonButton
                        onClick={() => {
                          copyCurrentUrl();
                          setUrlTextCopied(true);
                        }}
                      >
                        <img src={linkIcon} alt='' />
                        Скопировать ссылку
                      </CommonButton>
                      {player &&
                        (user.teams?.find((team) => team.teamRequests.find((req) => req.toUserId === profileUser.id)) ? (
                          <InFriendLabel>
                            <img src={sendedFriendReq} alt='' />
                            Приглашение отправлено
                          </InFriendLabel>
                        ) : !user.teams?.find((team) => team.members.find((member) => member.user.id === profileUser.id)) ? (
                          <CommonButton onClick={() => handleTeamInvite()}>
                            <img src={groupInviteIcon} alt='' />
                            Пригласить в команду
                          </CommonButton>
                        ) : (
                          <InFriendLabel>
                            <img src={inGroupIcon} alt='' />
                            Состоит в вашей команде<span>{user.teams[0].name}</span>
                          </InFriendLabel>
                        ))}
                      {urlTextCopied && <CopyUrlText>Ссылка скопирована!</CopyUrlText>}
                    </UserDataButtons>
                  </UserData>
                </UserDataContainer>
              </MainDataContainer>
              <FooterUserData>
                {!player &&
                  (editMode ? (
                    <SocialButtons>
                      <CancelEditButton onClick={cancelEdit}>
                        <img src={closeCross} alt='' />
                        Отменить изменения
                      </CancelEditButton>
                      <ConfirmEditButton onClick={confirmEdit} disabled={!updatedUserData.description && !updatedUserData.user_avatar}>
                        <img src={confirmEditIcon} alt='' />
                        Подтвердить изменения
                      </ConfirmEditButton>
                    </SocialButtons>
                  ) : (
                    <EditProfileButton
                      onClick={() => {
                        setEditMode(!editMode);
                        setUpdatedUserData({
                          user_avatar: profileUser.user_avatar as string,
                          description: profileUser.description as string,
                        });
                      }}
                    >
                      <img src={editProfileIcon} alt='' />
                      Редактировать профиль
                    </EditProfileButton>
                  ))}
                {!editMode && (
                  <SocialButtons>
                    {!player ? (
                      <>
                        <CommonButton>
                          <img src={FriendsIcon} alt='' />
                          Мои друзья
                        </CommonButton>

                        <CommonButton onClick={() => dispatch(changeChatState(true))}>
                          <img src={sendMessageIcon} alt='' />
                          Мои сообщения
                        </CommonButton>
                      </>
                    ) : (
                      <>
                        {user.sentRequests.length !== 0 &&
                        user.sentRequests.find((req) => req.fromUserId === user.id && req.toUserId === player.id) ? (
                          <FriendButtonContainer
                            onMouseEnter={() => setShowRemoveFriend(true)}
                            onMouseLeave={() => setShowRemoveFriend(false)}
                          >
                            <CommonButton style={{ position: 'relative' }}>
                              <img src={sendedFriendReq} alt='' />
                              Заявка отправлена
                            </CommonButton>
                            {transitions(
                              (styles, item) =>
                                item && (
                                  <RemoveFriendContainer style={styles}>
                                    <RemoveFriendButton
                                      onClick={() => {
                                        const id = user.sentRequests.find((req) => req.toUserId === profileUser.id)?.id as number;
                                        if (id) {
                                          cancelFriendRequest(id);
                                        }
                                      }}
                                    >
                                      <img src={removeFriendIcon} alt='' />
                                      Отменить заявку
                                    </RemoveFriendButton>
                                  </RemoveFriendContainer>
                                ),
                            )}
                          </FriendButtonContainer>
                        ) : user.receivedRequests.find((req) => req.toUserId === user.id && req.fromUserId === player.id) ? (
                          <FriendButtonContainer
                            onMouseEnter={() => setShowRemoveFriend(true)}
                            onMouseLeave={() => setShowRemoveFriend(false)}
                          >
                            <CommonButton style={{ position: 'relative' }}>
                              <img src={sendedFriendReq} alt='' />
                              Ждет вашего ответа
                            </CommonButton>
                            {transitions(
                              (styles, item) =>
                                item && (
                                  <RemoveFriendContainer style={{ ...styles, bottom: '-70px' }}>
                                    <ActionsList>
                                      <RemoveFriendButton
                                        onClick={() => {
                                          const id = user.receivedRequests.find((req) => req.fromUserId === profileUser.id)?.id as number;
                                          if (id) {
                                            friendRequestAnswer({ accept: true, requestId: id });
                                          }
                                        }}
                                      >
                                        <img src={confirmEditIcon} alt='' />
                                        Принять
                                      </RemoveFriendButton>
                                      <RemoveFriendButton
                                        onClick={() => {
                                          const id = user.receivedRequests.find((req) => req.fromUserId === profileUser.id)?.id as number;
                                          if (id) {
                                            friendRequestAnswer({ accept: false, requestId: id });
                                          }
                                        }}
                                      >
                                        <img src={cancelReqIcon} alt='' />
                                        Отклонить
                                      </RemoveFriendButton>
                                    </ActionsList>
                                  </RemoveFriendContainer>
                                ),
                            )}
                          </FriendButtonContainer>
                        ) : user.friends.find((friend) => friend.id === player.id) ? (
                          <FriendButtonContainer
                            onMouseEnter={() => setShowRemoveFriend(true)}
                            onMouseLeave={() => setShowRemoveFriend(false)}
                          >
                            <CommonButton style={{ position: 'relative', width: '190px' }}>
                              <img src={inFriendsIcon} alt='' />У вас в друзьях
                            </CommonButton>
                            {transitions(
                              (styles, item) =>
                                item && (
                                  <RemoveFriendContainer style={styles}>
                                    <RemoveFriendButton
                                      onClick={() => {
                                        const id = profileUser.id;
                                        if (id) {
                                          deleteFromFriends(user.id, id, user.nickname);
                                        }
                                      }}
                                    >
                                      <img src={removeFriendIcon} alt='' />
                                      Удалить из друзей
                                    </RemoveFriendButton>
                                  </RemoveFriendContainer>
                                ),
                            )}
                          </FriendButtonContainer>
                        ) : (
                          <CommonButton
                            onClick={() => {
                              sendRequest(player.id);
                            }}
                          >
                            <img src={addFriendsIcon} alt='' />
                            Добавить в друзья
                          </CommonButton>
                        )}

                        <CommonButton onClick={handleChatOpen}>
                          <img src={sendMessageIcon} alt='' />
                          Cообщение
                        </CommonButton>
                      </>
                    )}
                  </SocialButtons>
                )}
              </FooterUserData>
            </>
          )}
        </Container>
      </ProfileHeader>
      <Container>
        <ProfileMainContainer>
          <LeftContainer>
            <GameContainer>
              {(updateFaceitStatus === 'pending' || deleteCs2Status === 'pending') && (
                <>
                  <CircularProgress
                    color='error'
                    size={'100px'}
                    sx={{
                      zIndex: 3,
                      position: 'absolute',
                      inset: '0',
                      margin: 'auto',
                    }}
                  />
                  <LoaderBackground bgcolor='#333' borderradius='0px' />
                </>
              )}
              <GameIcon src={cs2ProfilePicture} />
              <Cs2Stats>
                {profileUser?.cs2_data ? (
                  <>
                    <Cs2StatsHeader>
                      <Cs2StatsText>
                        Уровень: <img src={profileUser?.cs2_data?.lvlImg} alt='' />
                      </Cs2StatsText>
                      <Cs2StatsText>{profileUser?.cs2_data.elo}&nbsp;elo</Cs2StatsText>
                    </Cs2StatsHeader>
                    <Cs2StatsMain>
                      <Cs2StatsText>
                        Матчи: &nbsp;<span>{profileUser?.cs2_data?.matches}</span>
                      </Cs2StatsText>
                      <Cs2StatsText>
                        Победы: &nbsp;<span>{profileUser?.cs2_data?.wins}</span>
                      </Cs2StatsText>
                      <Cs2StatsText>
                        Процент побед: &nbsp;<span>{profileUser?.cs2_data?.winrate} %</span>
                      </Cs2StatsText>
                      <Cs2StatsText>
                        КД: &nbsp;<span>{profileUser?.cs2_data?.kd}</span>
                      </Cs2StatsText>
                      <Cs2StatsText>
                        Убийств в голову: &nbsp;<span>{profileUser?.cs2_data?.hs} %</span>
                      </Cs2StatsText>
                    </Cs2StatsMain>

                    <RolesContainer>
                      <Cs2StatsText>Роли:</Cs2StatsText>
                      <Roles>{profileUser?.cs2_data?.roles?.map((role) => <Role key={role.cs2Role.name}>{role.cs2Role.name}</Role>)}</Roles>
                    </RolesContainer>

                    <MapsContainer>
                      <Cs2StatsText>Избранные карты:</Cs2StatsText>
                      <Maps>
                        {profileUser?.cs2_data?.maps?.map((map) => (
                          <img key={MapsImages[map.cs2Map.name]} src={MapsImages[map.cs2Map.name]} />
                        ))}
                      </Maps>
                    </MapsContainer>
                    {!player && (
                      <GameContainerButtons>
                        <DropDown>
                          <GameContainerButton>
                            Изменить <img src={dropDownArrow} alt='' />
                          </GameContainerButton>
                          <DropDownContent>
                            <DropDownButton onClick={() => handleUpdateFaceitData(user?.cs2_data?.steamId as string)}>
                              Обновить данные faceit
                            </DropDownButton>
                            <DropDownButton>Изменить роли/карты</DropDownButton>
                          </DropDownContent>
                        </DropDown>
                        <GameContainerButton onClick={handleDeleteCs2data}>Удалить игровой профиль</GameContainerButton>
                      </GameContainerButtons>
                    )}
                  </>
                ) : !player ? (
                  <CreateGameProfileButton onClick={() => dispatch(changeGameProfileState(true))}>
                    Создать игровой профиль
                  </CreateGameProfileButton>
                ) : (
                  <p style={{ color: '#fff', textAlign: 'center' }}>У этого пользователя нет игрового профиля</p>
                )}
              </Cs2Stats>
            </GameContainer>
            <GameContainer>
              <GameIcon src={valorantProfilePicture} />
              <ValorantStats>
                {profileUser.valorant_data ? (
                  <></>
                ) : !player ? (
                  <CreateGameProfileButton onClick={() => dispatch(changeGameProfileState(true))}>
                    Создать игровой профиль
                  </CreateGameProfileButton>
                ) : (
                  <p style={{ color: '#fff', textAlign: 'center' }}>У этого пользователя нет игрового профиля</p>
                )}
              </ValorantStats>
            </GameContainer>
          </LeftContainer>
          <RightContainer>
            <Description>
              <RightContentTitle>Описание</RightContentTitle>
              {editMode ? (
                <DescriptionInput
                  onChange={(e) => {
                    handleChangeDescription(e);
                  }}
                  $editMode={editMode}
                  placeholder='Напишите о себе...'
                  value={updatedUserData.description as string}
                />
              ) : (
                <DescriptionText>{profileUser.description ? profileUser.description : 'Информация отсутствует...'}</DescriptionText>
              )}
            </Description>
            <Teams>
              <RightContentTitle>Команды</RightContentTitle>
              <TeamsContainer>
                {profileUser.teams.length > 0
                  ? profileUser.teams.map((team) => (
                      <Team
                        key={team.id}
                        onClick={() => {
                          navigate(`/team/${team.name}`);
                        }}
                      >
                        <div>
                          <img src={team.avatar} alt='' />
                          <span>{team.name}</span>
                        </div>
                        <span>{team.members.length + 1}/5</span>
                      </Team>
                    ))
                  : profileUser.memberOf.map(({ team }) => (
                      <Team
                        key={team.id}
                        onClick={() => {
                          navigate(`/team/${team.name}`);
                        }}
                      >
                        <div>
                          <img src={team.avatar} alt='' />
                          <span>{team.name}</span>
                        </div>
                        <span>{team.members.length + 1}/5</span>
                      </Team>
                    ))}
              </TeamsContainer>
            </Teams>
          </RightContainer>
        </ProfileMainContainer>
      </Container>
    </>
  );
};

const ProfileHeader = styled.div`
  min-height: 250px;
  padding: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('${headerBg}');
    z-index: -1;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  @media (max-width: 650px) {
    min-height: 330px;
  }
`;

const MainDataContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  column-gap: 20px;
`;
const ProfileAvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const ChangeAvatarButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  padding: 12px;
  background-color: #323232;
  border-radius: 50%;
  right: 5px;
  bottom: 5px;
  cursor: pointer;

  position: absolute;
  transition: background-color 0.2s ease-in-out;
  border: 2px solid #fff;
  &:hover {
    background-color: #535353;
  }
`;
const ChangeAvatarButtonIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
`;
const ProfileAvatar = styled.img<{ $avatarIsLoading: boolean }>`
  display: block;
  border-radius: 50%;
  width: 160px;
  height: 160px;

  border: 4px solid #2b2b2b;
  box-shadow: 0px 3px 15px 10px rgba(0, 0, 0, 0.6);
  position: relative;
  opacity: ${(p) => (p.$avatarIsLoading ? '0.4' : '1')};
  object-fit: cover;
`;

const UserDataContainer = styled.div`
  display: flex;
  position: relative;
  padding: 15px 30px;
  width: 50%;
  &::before {
    border-radius: 5px;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #333;
    opacity: 0.9;
  }
`;
const UserData = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  z-index: 1;
`;
const UserNickname = styled.h5`
  font-size: 22px;
  color: #fff;
`;

const UserGender = styled.span`
  font-weight: 400;
  font-size: 17px;
  color: #cdcdcd;
`;

const UserAge = styled.p`
  font-size: 17px;
  color: #ccc8c8;
`;

const UserDataButtons = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 15px;
  flex-wrap: wrap;
`;

const FooterUserData = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const SocialButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  column-gap: 15px;
  padding: 10px 0;
  flex-wrap: wrap;
`;
const InFriendLabel = styled(CommonButton)`
  min-width: 190px;
  &:hover {
    background-color: #181818;
    border-color: #565656;
  }
  span {
    font-weight: 700;
    color: #dbdbdb;
  }
`;
const ProfileMainContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 40px 0;
  @media (max-width: 980px) {
    flex-direction: column;

    align-items: center;
  }
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 50px;
  width: 65%;
  @media (max-width: 980px) {
    width: 95%;
  }
`;
const RightContainer = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
  @media (max-width: 980px) {
    width: 100%;
  }
`;

const GameContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  background-color: #202020;
  width: 100%;
  position: relative;
  border-radius: 15px;
`;

const GameIcon = styled.img`
  width: 100%;
  max-width: 220px;
  height: 350px;
`;

const Cs2Stats = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const Cs2StatsHeader = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
  column-gap: 15px;
`;
const Cs2StatsMain = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  flex-wrap: wrap;
  column-gap: 3%;
  row-gap: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #333;
`;

const Cs2StatsText = styled.p`
  white-space: nowrap;
  font-size: 14px;
  color: #9f9f9f;
  display: flex;
  align-items: center;

  span {
    font-size: 16px;
    font-weight: 700;
    color: #e0e0e0;
  }

  img {
    margin-left: 10px;
    width: 45px;
  }
`;

const RolesContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #333;
  flex-wrap: wrap;
  @media (max-width: 980px) {
    flex-wrap: wrap;
  }
  &:last-child {
    padding: 0;
    border: 0;
  }
`;

const Roles = styled.div`
  display: flex;
  column-gap: 20px;
`;

const Role = styled.div`
  color: #fff;
`;

const Maps = styled(Roles)`
  img {
    width: 100px;
    border-radius: 5px;
  }
`;

const GameContainerButtons = styled.div`
  width: 100%;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const CreateGameProfileButton = styled(CommonButton)`
  border-color: #d82f2f;
  display: block;
`;

const GameContainerButton = styled(CommonButton)`
  border-color: #d8702f;
  padding-inline: 27px;
`;

const EditProfileButton = styled(CommonButton)`
  align-self: flex-start;
`;

const ConfirmEditButton = styled(CommonButton)`
  border-color: #5cd82f;
  &:disabled {
    border-color: #565656;
  }
`;

const CancelEditButton = styled(CommonButton)`
  border-color: #d82f2f;
`;

const DropDownContent = styled.div`
  border-radius: 5px;
  width: 100%;
  position: absolute;
  display: none;
  z-index: 2;
  border-radius: 3px 3px 5px 5px;
  top: 30px;
  box-shadow: 0px 4px 15px #d8702f;
  overflow: hidden;
`;
const DropDown = styled.div`
  position: relative;

  &:hover ${DropDownContent} {
    display: block;
  }
`;

const DropDownButton = styled(CommonButton)`
  border-radius: 0px;
  border: 0;
  &:hover {
    color: aliceblue;
    background-color: #232323;
  }
`;

const MapsContainer = styled(RolesContainer)``;

const ValorantStats = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const RightContentTitle = styled.h3`
  color: #fff;
`;

const Description = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const DescriptionText = styled.p`
  padding: 9px 15px;
  color: #fff;
  background-color: #2f2f2f;
  min-height: 220px;
  border-radius: 5px;
  font-size: 14px;
`;

const DescriptionInput = styled.textarea<{ $editMode: boolean }>`
  font-size: 14px;
  padding: 10px 15px;
  color: #fff;
  background-color: #2f2f2f;
  min-height: 220px;
  border-radius: 5px;
  border: ${(p) => (p.$editMode ? '1px solid #d82f2f' : 'none')};
  resize: none;
  &::placeholder {
    font-size: 15px;
  }
`;

const Teams = styled(Description)`
  margin-top: 20px;
`;

const CopyUrlText = styled.span`
  color: #fff;
  font-size: 13px;
`;

const TeamsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;
const Team = styled.div`
  width: 100%;
  color: var(--main-text-color);
  background-color: #2f2f2f;
  display: flex;
  column-gap: 10px;
  align-items: center;
  border-radius: 5px;
  justify-content: space-between;
  padding: 5px 10px;
  &:hover {
    cursor: pointer;
    background-color: #3d3d3d;
  }
  > div {
    display: flex;
    column-gap: 10px;
    align-items: center;

    > img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 5px;
    }
    > span {
      font-size: 16px;
    }
  }
`;

const FriendButtonContainer = styled.div`
  position: relative;
`;

const RemoveFriendContainer = styled(animated.div)`
  position: absolute;
  width: 100%;
  background-color: #202020;
  bottom: -30px;
  border: 1px solid #3f3f3f;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
  &:hover {
    cursor: pointer;
  }
`;

const RemoveFriendButton = styled.div`
  width: 100%;
  column-gap: 10px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  color: var(--main-text-color);
  font-size: 14px;
  padding: 3px;
  img {
    width: 25px;
    height: 25px;
    filter: invert(0.8);
  }

  &:hover {
    background-color: #575757;
  }
`;

const ActionsList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

export default ProfilePage;
