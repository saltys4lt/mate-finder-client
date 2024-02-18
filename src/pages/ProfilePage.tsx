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

interface UpdatedUserData {
  description: string | null;
  user_avatar: string | null;
}

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const nickname = useParams().nickname;
  const user = useSelector((state: RootState) => state.userReducer.user);
  const player = useSelector((root: RootState) => root.playerReducer.player);
  const playerError = useSelector((root: RootState) => root.playerReducer.fetchPlayerByNameError);
  const updateFaceitStatus = useSelector((root: RootState) => root.userReducer.updateCs2DataStatus);
  const [profileUser, setProfileUser] = useState<ClientUser | Player | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [urlTextCopied, setUrlTextCopied] = useState<boolean>(false);
  const [filename, setFileName] = useState<string>('');
  const [updatedUserData, setUpdatedUserData] = useState<UpdatedUserData>({
    description: '',
    user_avatar: '',
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
  }, [nickname, player]);

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

  const cancelEdit = async () => {
    setEditMode(false);
    if (updatedUserData.user_avatar) {
      const storageRef = ref(storage, `avatars/${filename}`);

      await deleteObject(storageRef);
    }
    setFileName('');
    setUpdatedUserData({ description: '', user_avatar: '' });
  };
  const confirmEdit = async () => {
    //добавить запрос
  };
  const openFileExplorer = () => {
    document.getElementById('file__input')?.click();
  };

  const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const avatar = e.target.files[0];
    const storageRef = ref(storage, `avatars/${avatar.name}`);
    await uploadBytes(storageRef, avatar).then(() => {
      getDownloadURL(storageRef).then((url: string) => {
        setFileName(avatar.name);
        setUpdatedUserData({ user_avatar: url, description: updatedUserData.description });
      });
    });
  };

  return (
    <>
      <Modal />
      <ProfileHeader>
        <Container>
          <MainDataContainer>
            <ProfileAvatarContainer>
              <ProfileAvatar src={updatedUserData.user_avatar ? updatedUserData.user_avatar : profileUser?.user_avatar} alt='' />
              {editMode && (
                <>
                  <ChangeAvatarButton onClick={openFileExplorer}>
                    <ChangeAvatarButtonIcon src='/images/edit.png' alt='' />
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
            </ProfileAvatarContainer>
            <UserDataContainer>
              <UserData>
                <UserNickname>{profileUser?.nickname}</UserNickname>
                <UserAge>Возраст: {dateToUserAge(profileUser?.birthday as string)}</UserAge>

                <UserDataButtons>
                  <CommonButton
                    onClick={() => {
                      copyCurrentUrl();
                      setUrlTextCopied(true);
                    }}
                  >
                    <img src='/images/link.png' alt='' />
                    Скопировать ссылку
                  </CommonButton>
                  {player && (
                    <CommonButton>
                      <img src='/images/group-invite.png' alt='' />
                      Пригласить в команду
                    </CommonButton>
                  )}
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
                    <img src='/images/close-cross.png' alt='' />
                    Отменить изменения
                  </CancelEditButton>
                  <ConfirmEditButton onClick={confirmEdit}>
                    <img src='/public/images/confirm-edit.png' alt='' />
                    Подтвердить изменения
                  </ConfirmEditButton>
                </SocialButtons>
              ) : (
                <EditProfileButton
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                >
                  <img src='/images/edit-profile.png' alt='' />
                  Редактировать профиль
                </EditProfileButton>
              ))}
            <SocialButtons>
              {!player ? (
                <>
                  <CommonButton>
                    <img src='/images/friends.png' alt='' />
                    Мои друзья
                  </CommonButton>

                  <CommonButton>
                    <img src='/images/send-message.png' alt='' />
                    Мои сообщения
                  </CommonButton>
                </>
              ) : (
                <>
                  <CommonButton>
                    <img src='/images/add-friend.png' alt='' />
                    Добавить в друзья
                  </CommonButton>
                  <CommonButton>
                    <img src='/images/send-message.png' alt='' />
                    Cообщение
                  </CommonButton>
                </>
              )}
            </SocialButtons>
          </FooterUserData>
        </Container>
      </ProfileHeader>
      <Container>
        <ProfileMainContainer>
          <LeftContainer>
            <GameContainer>
              {updateFaceitStatus === 'pending' && (
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
                  <LoaderBackground bgColor='#333' borderRadius='0px' />
                </>
              )}
              <GameIcon src='/images/cs2-profile-pic.jpeg' />
              <Cs2Stats>
                {profileUser?.cs2_data ? (
                  <>
                    <Cs2StatsHeader>
                      <Cs2StatsText>
                        Уровень: <img src={profileUser?.cs2_data?.lvlImg} alt='' />
                      </Cs2StatsText>
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
                            Изменить <img src='/images/drop-down-arrow.png' alt='' />
                          </GameContainerButton>
                          <DropDownContent>
                            <DropDownButton onClick={() => handleUpdateFaceitData(user?.cs2_data?.steamId as string)}>
                              Обновить данные faceit
                            </DropDownButton>
                            <DropDownButton>Изменить роли/карты</DropDownButton>
                          </DropDownContent>
                        </DropDown>
                        <GameContainerButton onClick={() => {}}>Удалить игровой профиль</GameContainerButton>
                      </GameContainerButtons>
                    )}
                  </>
                ) : !player ? (
                  <CreateGameProfileButton>Создать игровой профиль</CreateGameProfileButton>
                ) : (
                  <p style={{ color: '#fff', textAlign: 'center' }}>У этого пользователя нет игрового профиля</p>
                )}
              </Cs2Stats>
            </GameContainer>
            <GameContainer>
              <GameIcon src='/images/valorant-profile-pic.jpg' />
              <ValorantStats>
                {profileUser.valorant_data ? (
                  <></>
                ) : !player ? (
                  <CreateGameProfileButton>Создать игровой профиль</CreateGameProfileButton>
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
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setUpdatedUserData({ ...updatedUserData, description: e.target.value });
                  }}
                  $editMode={editMode}
                  placeholder='Напишите о себе...'
                />
              ) : (
                <DescriptionText>{profileUser.description ? profileUser.description : 'Информация отсутствует...'}</DescriptionText>
              )}
            </Description>
            <Teams>
              <RightContentTitle>Команды</RightContentTitle>
              <TeamsContainer>
                <Team></Team>
              </TeamsContainer>
            </Teams>
          </RightContainer>
        </ProfileMainContainer>
      </Container>
    </>
  );
};

const ProfileHeader = styled.div`
  background-color: #7a7a7a;
  min-height: 250px;
  padding: 16px;
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
const ProfileAvatar = styled.img`
  display: block;
  background-color: white;
  border-radius: 50%;
  width: 160px;
  height: 160px;
  position: relative;
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
  width: 100%;
`;
const Cs2StatsHeader = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
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
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const CreateGameProfileButton = styled(CommonButton)`
  border-color: #d82f2f;
  align-self: center;
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
const Team = styled.div``;
export default ProfilePage;
