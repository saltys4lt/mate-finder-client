import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState, useAppDispatch } from '../redux';
import { dateToUserAge } from '../util/dateToUserAge';
import Container from '../components/Container';
import CommonButton from '../components/UI/CommonButton';
import MapsImages from '../consts/MapsImages';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import fetchPlayerByName from '../redux/playerThunks/fetchPlayerByName';
import ClientUser from '../types/ClientUser';
import Player from '../types/Player';
import { setPlayer, setPlayerError } from '../redux/playerSlice';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const nickname = useParams().nickname;
  const user = useSelector((state: RootState) => state.userReducer.user);
  const player = useSelector((root: RootState) => root.playerReducer.player);
  const playerError = useSelector((root: RootState) => root.playerReducer.fetchPlayerByNameError);
  const [profileUser, setProfileUser] = useState<ClientUser | Player | null>(null);

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

  if (playerError) {
    dispatch(setPlayer(null));
    dispatch(setPlayerError(null));
    navigate('/');
  }

  if (!profileUser) {
    return <Loader />;
  }

  return (
    <>
      <Modal />
      <ProfileHeader>
        <Container>
          <MainDataContainer>
            <ProfileAvatarContainer>
              <ProfileAvatar src={profileUser?.user_avatar} alt='' />
              {!player && (
                <>
                  <ChangeAvatarButton>
                    <ChangeAvatarButtonIcon src='/images/edit.png' alt='' />
                  </ChangeAvatarButton>
                  <input
                    style={{ display: 'none' }}
                    id='file__input'
                    className='file__upload__input'
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={() => {}}
                  />
                </>
              )}
            </ProfileAvatarContainer>
            <UserDataContainer>
              <UserData>
                <UserNickname>{profileUser?.nickname}</UserNickname>
                <UserAge>Возраст: {dateToUserAge(profileUser?.birthday as string)}</UserAge>
                <UserDataButtons>
                  <CommonButton>
                    <img src='/images/link.png' alt='' />
                    Скопировать ссылку
                  </CommonButton>
                  {player && (
                    <CommonButton>
                      <img src='/images/group-invite.png' alt='' />
                      Пригласить в команду
                    </CommonButton>
                  )}
                </UserDataButtons>
              </UserData>
            </UserDataContainer>
          </MainDataContainer>
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
        </Container>
      </ProfileHeader>
      <Container>
        <ProfileMainContainer>
          <LeftContainer>
            <GameContainer>
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
                        <GameContainerButton>Обновить данные</GameContainerButton>
                        <GameContainerButton>Удалить игровой профиль</GameContainerButton>
                      </GameContainerButtons>
                    )}
                  </>
                ) : !player ? (
                  <CreateGameProfileButton>Создайте игровой профиль</CreateGameProfileButton>
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
                  <CreateGameProfileButton>Создайте игровой профиль</CreateGameProfileButton>
                ) : (
                  <p style={{ color: '#fff', textAlign: 'center' }}>У этого пользователя нет игрового профиля</p>
                )}
              </ValorantStats>
            </GameContainer>
          </LeftContainer>
          <RightContainer></RightContainer>
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

const SocialButtons = styled.div`
  width: 100%;
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
  margin-top: 40px;
  @media (max-width: 980px) {
    flex-direction: column;

    align-items: center;
  }
`;
const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 50px;
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
  overflow: hidden;
  background-color: #1b1b1b;
`;

const GameIcon = styled.img`
  width: 220px;
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
  margin-top: 30px;
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
`;

const MapsContainer = styled(RolesContainer)``;

const ValorantStats = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

export default ProfilePage;
