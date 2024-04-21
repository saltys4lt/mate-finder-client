import Container from '../components/Container';
import styled from 'styled-components';
import cs2Logo from '../assets/images/cs2-logo.png';
import { ChangeEvent, useState, useEffect } from 'react';
import Team from '../types/Team';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import ClientUser from '../types/ClientUser';
import { useSpring, animated } from '@react-spring/web';
import CommonInput from '../components/UI/CommonInput';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { CircularProgress, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Select, { SingleValue } from 'react-select';
import { CustomOption, CustomSingleValue, customStyles } from '../components/UI/GameSelect';
import Games from '../consts/Games';
import Option from '../types/Option';
import { checkUserGameProfile } from '../util/checkUserGameProfile';
import cs2CreationBg from '../assets/images/cs-creation-bg.webp';
import editIcon from '../assets/images/edit.png';
import uploadTeamAvatar from '../api/uploadTeamAvatar';
import Swal from 'sweetalert2';
import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';
import ConfirmButton from '../components/UI/ConfirmButton';
import CommonButton from '../components/UI/CommonButton';
import friendsInviteIcon from '../assets/images/friends.png';
import { changeFriendsInviteModalState, changeInvitedFriendsModalState } from '../redux/modalSlice';
import FriendsInviteModal from '../components/FriendsInviteModal';
import { FriendWithRole } from '../types/FriendWithRole';
interface CreationDataValidation {
  isRolesValid: boolean;
}

const TeamCreationPage = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const [availableGames, setAvailableGames] = useState<Option[]>(Games);
  const [avatarIsLoading, setAvatarIsLoading] = useState<boolean>(false);
  const [ownerRole, setOwnerRole] = useState<string>('');
  const [creationStep, setCreationStep] = useState<number>(1);
  const [roles, setRoles] = useState<string[]>([]);
  const [invitedFriends, setInvitedFriends] = useState<FriendWithRole[]>([]);
  const [dataValidation, setDataValidation] = useState<CreationDataValidation>({
    isRolesValid: true,
  });

  const [team, setTeam] = useState<Team>({
    name: '',
    avatar: cs2Logo,
    game: 'cs2',
    description: '',
    public: true,
    ownerId: user.id,
    players: [],
  });
  const [game, setGame] = useState<SingleValue<Option>>();
  const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setAvatarIsLoading(true);
    if (e.target.files[0].size > 500 * 1024) {
      Swal.fire({
        icon: 'error',
        titleText: 'Ошибка размера!',
        text: 'Ваш файл превышает размер в 500 кб',
        confirmButtonText: 'Понятно',
      });
      return;
    }
    const avatar = e.target.files[0];
    const formData = new FormData();
    console.log('Размер' + avatar.size);
    formData.append('avatar', avatar);
    console.log(formData);

    uploadTeamAvatar(formData)
      .then((res) => {
        setTeam({ ...team, avatar: res as string });
        setAvatarIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleTeamNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeam({ ...team, name: e.target.value });
  };

  const handleTeamDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTeam({ ...team, description: e.target.value });
  };
  const handleTeamTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'true') {
      setTeam({ ...team, public: true });
    } else setTeam({ ...team, public: false });
  };

  const handleGameChange = (game: SingleValue<Option>) => {
    setGame(game);
  };

  const rolePlayersState = (role: string) => {
    if (roles.includes(role) && !invitedFriends.find((friend) => friend.role === role)) return 'active';
    if (role === ownerRole || !ownerRole || invitedFriends.find((friend) => friend.role === role)) return 'focus';
    else return '';
  };
  const changePlayersRoles = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (!dataValidation.isRolesValid) {
    //   setDataValidation({ ...dataValidation, isRolesValid: true });
    // }
    if (!roles.includes(e.target.value)) setRoles([...roles, e.target.value]);
    else setRoles(roles.filter((role) => role !== e.target.value));
  };
  console.log(roles);
  const changeOwnerRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const invitedFriend = invitedFriends.find((friend) => friend.role === e.target.value);
    if (invitedFriend) {
      Swal.fire({
        icon: 'warning',
        title: 'Уверены?',

        html: `
  <div style="background-color: #f0f0f0; border-radius: 10px; padding: 10px;">
  <p>Если вы выберите эту роль, то приглашение для <strong>${invitedFriend.nickname}</strong> будет отменено</p>
  <div style="margin-top:10px; display: flex; column-gap:15px; justify-content:center; align-items: center; width:100%">
    <img src="${invitedFriend.user_avatar}" alt="Аватар" style="border-radius: 50%; width: 70px; height: 70px; object-fit:cover;">
    <div style="margin-top: 10px;">${invitedFriend.nickname}</div>
  </div>
</div>
  `,

        confirmButtonText: 'Да',
        confirmButtonColor: '#b42020',
        showCancelButton: true,
        cancelButtonText: 'Отмена',
      }).then((res) => {
        if (res.isConfirmed) {
          setOwnerRole(e.target.value);

          setInvitedFriends(invitedFriends.filter((friend) => friend.id !== invitedFriend.id));
        } else {
          return;
        }
      });
    } else setOwnerRole(e.target.value);
    console.log('сделало');
    if (roles.includes(e.target.value)) setRoles(roles.filter((role) => role !== e.target.value));
  };

  const ownerRoleState = (role: string) => {
    return ownerRole === role ? 'active' : '';
  };

  useEffect(() => {
    if (checkUserGameProfile(user as ClientUser) === 2) {
      setGame({ image: '', label: 'Выберите игру', value: 'both' } as Option);
    }
    if (checkUserGameProfile(user as ClientUser) === 1) {
      setGame(Games[0]);
      setAvailableGames([Games[0]]);
    }
    if (checkUserGameProfile(user as ClientUser) === 0) {
      setGame(Games[1]);
      setAvailableGames([Games[1]]);
    }

    return () => {};
  }, []);

  const openFileExplorer = () => {
    document.getElementById('file__input')?.click();
  };

  const firstStep = useSpring({
    opacity: creationStep === 1 ? 1 : 0,
    from: { opacity: 0 },
  });

  const secondStep = useSpring({
    opacity: creationStep === 2 ? 1 : 0,
    from: { opacity: 0 },
  });

  const thirdStep = useSpring({
    opacity: creationStep === 3 ? 1 : 0,
    from: { opacity: 0 },
  });

  const fourthStep = useSpring({
    opacity: creationStep === 4 ? 1 : 0,
    from: { opacity: 0 },
  });

  return (
    <Main>
      <FriendsInviteModal
        roles={roles}
        ownerRole={ownerRole}
        invitedFriends={invitedFriends}
        setInvitedFriends={setInvitedFriends}
        setRoles={setRoles}
      />
      <Container>
        <MainContainer>
          <TeamCreationTitle>Регистрация команды</TeamCreationTitle>
          <hr style={{ marginTop: '-40px', width: '100%' }} />
          <InnerContainer>
            {creationStep === 1 && (
              <GameAndStatus style={firstStep}>
                <TeamData>
                  <TeamDataText>Игра</TeamDataText>
                  <div style={{ display: 'flex', alignItems: 'center', columnGap: '5px', color: 'var(--main-text-color)' }}>
                    <Select
                      maxMenuHeight={130}
                      isSearchable={false}
                      styles={{
                        ...customStyles,
                        control: (base: any) => ({
                          ...base,
                          width: '300px',
                          background: '#181818',
                          boxShadow: '0',
                          borderColor: '#484848',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: '#808080',
                          },
                        }),
                      }}
                      options={availableGames}
                      value={game}
                      onChange={handleGameChange}
                      components={{
                        Option: CustomOption,
                        SingleValue: CustomSingleValue,
                      }}
                      placeholder='Выбор игры'
                    ></Select>
                    <ErrorOutlineContainer>
                      <ErrorOutline />
                      <GameExplenation>
                        Список достпуных игр зависит от ваших игровых профелей. Если вы не регистрировали профиль с какой-то игрой, то и
                        создать команду с этой игрой нельзя.
                      </GameExplenation>
                    </ErrorOutlineContainer>
                  </div>
                </TeamData>

                <TeamData>
                  <TeamDataText style={{ display: 'flex', columnGap: '5px', position: 'relative' }}>
                    <span>Публичная / Приватная:</span>
                    <ErrorOutlineContainer>
                      <ErrorOutline />
                      <TypeExplenation>
                        Приватные команды не видны другим игрокам в глобальном поиске. Вы сможете собрать команду только приглашая игроков
                        самостоятельно.
                      </TypeExplenation>
                    </ErrorOutlineContainer>
                  </TeamDataText>
                  <RadioGroup
                    style={{ color: 'var(--main-text-color)' }}
                    row
                    defaultValue={'any'}
                    value={team.public}
                    onChange={(e) => handleTeamTypeChange(e)}
                  >
                    <FormControlLabel
                      value='true'
                      control={
                        <Radio
                          sx={{
                            color: 'grey',
                            '&.Mui-checked': {
                              color: 'red',
                            },
                          }}
                        />
                      }
                      label='Публичная'
                    />
                    <FormControlLabel
                      value='false'
                      control={
                        <Radio
                          sx={{
                            color: 'grey',
                            '&.Mui-checked': {
                              color: 'red',
                            },
                          }}
                        />
                      }
                      label='Приватная'
                    />
                  </RadioGroup>
                </TeamData>
              </GameAndStatus>
            )}
            {creationStep === 2 && (
              <TeamLogoContainer style={secondStep}>
                <TeamData>
                  <TeamDataText>Логотип: </TeamDataText>

                  <TeamLogo>
                    <TeamLogoImg loading={avatarIsLoading.toString()} src={team.avatar} />
                    <ChangeAvatarButton loading={avatarIsLoading.toString()} disabled={avatarIsLoading} onClick={openFileExplorer}>
                      <ChangeAvatarButtonIcon src={editIcon} alt='' />
                    </ChangeAvatarButton>
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
                  </TeamLogo>
                </TeamData>

                <input
                  style={{ display: 'none' }}
                  id='file__input'
                  className='file__upload__input'
                  type='file'
                  accept='image/png, image/jpeg, image/webp'
                  onChange={(e) => {
                    uploadAvatar(e);
                  }}
                />
                <NameAndDesc>
                  <TeamData>
                    <TeamDataText>Название: </TeamDataText>
                    <CommonInput onChange={handleTeamNameChange} placeholder='...' value={team.name} style={{ maxWidth: '250px' }} />
                  </TeamData>
                  <TeamData>
                    <TeamDataText>Информация: </TeamDataText>
                    <DescriptionInput onChange={handleTeamDescChange} placeholder='Кто вы, что вы и зачем ' value={team.description} />
                  </TeamData>
                </NameAndDesc>
              </TeamLogoContainer>
            )}
            {creationStep === 3 && (
              <RolesData style={thirdStep}>
                <TeamDataText>Ваша роль в команде:</TeamDataText>
                <RolesContainer>
                  {Cs2PlayerRoles.map((role, index) => (
                    <RoleCard key={role.id}>
                      <RoleCheckbox
                        id={(index + 1).toString()}
                        checked={ownerRole === role.name}
                        type='radio'
                        onChange={(e) => changeOwnerRole(e)}
                        value={role.name}
                      />
                      <RoleLabel className={ownerRoleState(role.name)} htmlFor={(index + 1).toString()}>
                        {role.name}
                      </RoleLabel>
                    </RoleCard>
                  ))}
                </RolesContainer>
              </RolesData>
            )}
            {creationStep === 4 && (
              <RolesData style={fourthStep}>
                <div style={{ display: 'flex', columnGap: '10px', alignItems: 'center', color: '#fff' }}>
                  <TeamDataText>В каких игроках вы нуждаетесь:</TeamDataText>
                  <ErrorOutlineContainer>
                    <ErrorOutline />
                    <GameExplenation style={{ top: '-7em', right: '-12em' }}>
                      Эти позиции будут отображены в поиске команд и на странице вашей команды как те, в которых вы нуждаетесь.
                    </GameExplenation>
                  </ErrorOutlineContainer>
                </div>

                <RolesContainer>
                  {Cs2PlayerRoles.map((role, index) => (
                    <RoleLableContainer key={role.id}>
                      <RoleCard key={role.id}>
                        <RoleCheckbox
                          id={(index + 10).toString()}
                          onChange={(e) => changePlayersRoles(e)}
                          value={role.name}
                          type='checkbox'
                          disabled={
                            role.name === ownerRole || !ownerRole || invitedFriends.find((friend) => friend.role === role.name)
                              ? true
                              : false
                          }
                        />
                        <RoleLabel className={rolePlayersState(role.name)} htmlFor={(index + 10).toString()}>
                          {role.name}
                        </RoleLabel>
                      </RoleCard>
                      {role.name === ownerRole && <span>Вы</span>}
                      {invitedFriends.length !== 0 &&
                        role.name === (invitedFriends.find((friend) => friend.role === role.name)?.role as string) && (
                          <img src={invitedFriends.find((friend) => friend.role === role.name)?.user_avatar as string} />
                        )}
                    </RoleLableContainer>
                  ))}
                </RolesContainer>
                <div style={{ display: 'flex', columnGap: '10px', alignItems: 'center', color: '#fff', marginTop: 50 }}>
                  <InviteFriendsButton
                    disabled={roles.length === 4}
                    onClick={() => {
                      dispatch(changeFriendsInviteModalState(true));
                    }}
                  >
                    <img src={friendsInviteIcon} alt='' />
                    Пригласить друзей
                  </InviteFriendsButton>
                  <ErrorOutlineContainer>
                    <ErrorOutline />
                    <GameExplenation style={{ top: '-6em' }}>
                      Роль для друга можно выбрать только из оставшихся ролей сверху.
                    </GameExplenation>
                  </ErrorOutlineContainer>
                </div>

                {invitedFriends.length !== 0 && (
                  <InvitedFriendsButton
                    onClick={() => {
                      dispatch(changeInvitedFriendsModalState(true));
                    }}
                  >
                    Приглашенные <div>{invitedFriends.length}</div>
                  </InvitedFriendsButton>
                )}
              </RolesData>
            )}
            <StepButtons>
              {creationStep !== 1 && (
                <ConfirmButton
                  onClick={() => {
                    setCreationStep((prev) => prev - 1);
                  }}
                >
                  Назад
                </ConfirmButton>
              )}
              <ConfirmButton
                onClick={() => {
                  setCreationStep((prev) => prev + 1);
                }}
              >
                Далее
              </ConfirmButton>
            </StepButtons>
          </InnerContainer>
        </MainContainer>
      </Container>
    </Main>
  );
};

const Main = styled.main`
  padding-block: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('${cs2CreationBg}');
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(10px);
    z-index: -1;
  }
`;

const MainContainer = styled.div`
  background-color: #252525;
  margin: 0 auto;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 50px;
  border-radius: 15px;
  padding: 30px 30px;
  height: 530px;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`;

const TeamCreationTitle = styled.h2`
  color: var(--main-text-color);
`;

const TeamLogoContainer = styled(animated.div)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const TeamLogo = styled.div`
  width: fit-content;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const TeamLogoImg = styled.img<{ loading: string }>`
  max-width: 200px;
  border-radius: 10px;
  opacity: ${(p) => (p.loading === 'true' ? '0.4' : '1')};
`;
const ChangeAvatarButton = styled.button<{ loading: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  padding: 12px;
  background-color: #323232;
  border-radius: 50%;
  right: -10px;
  bottom: -10px;
  cursor: pointer;
  opacity: ${(p) => (p.loading === 'true' ? '0.4' : '1')};
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

const GameAndStatus = styled(animated.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const NameAndDesc = styled.div`
  width: 55%;
  display: flex;
  flex-direction: column;
  row-gap: 30px;
`;

const TypeExplenation = styled.p`
  display: none;
  width: 200px;
  font-size: 14px;
  font-weight: 400;
  position: absolute;
  top: -140px;
  right: -160px;
  background-color: #333333;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 10px #333333;
`;

const GameExplenation = styled(TypeExplenation)`
  display: none;
  width: 200px;
  font-size: 14px;
  font-weight: 400;
  position: absolute;
  top: -13em;
  right: -10em;
  background-color: #333333;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 10px #333333;
`;

const TeamDataText = styled.h4`
  font-size: 18px;
  color: var(--main-text-color);
`;

const TeamData = styled(animated.div)`
  display: flex;
  row-gap: 10px;

  flex-direction: column;
`;

const RolesData = styled(TeamData)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InviteFriendsButton = styled(CommonButton)`
  font-size: 20px;
  text-align: center;
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  font-size: 16px;
  padding: 10px 15px;
  color: var(--main-text-color);

  background-color: #181818;

  min-height: 150px;
  border-radius: 5px;
  border: 2px solid #565656;

  resize: none;
  &::placeholder {
    font-size: 15px;
  }
`;

const ErrorOutlineContainer = styled.div`
  position: relative;
  cursor: help;
  &:hover ${TypeExplenation} {
    display: block;
    z-index: 10;
  }
`;

const ErrorOutline = styled(ErrorOutlineIcon)``;

const StepButtons = styled.div`
  display: flex;
  align-items: center;
  column-gap: 30px;
`;

const RolesContainer = styled.div`
  display: flex;
  width: 80%;
  justify-content: center;

  column-gap: 10px;
  flex-wrap: wrap;
`;

const RoleCard = styled.div`
  margin-top: 15px;

  display: flex;
  justify-content: center;
`;

const RoleCheckbox = styled.input`
  display: none;
`;
const RoleLableContainer = styled.div`
  position: relative;
  > img {
    position: absolute;
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;

    top: -1px;
    right: -1px;
    transition: transform 0.1s ease-in-out;
  }

  > img:hover {
    transform: scale(1.2);
  }
  > span {
    position: absolute;
    top: 3px;
    left: 50%;
    transform: translate(-50%, -50%);

    color: var(--main-text-color);
  }
`;
const RoleLabel = styled.label`
  border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;
  display: block;
  width: 130px;
  text-align: center;
  font-size: 16px;
  color: #d1cfcf;

  &:hover {
    border-color: #fff;
    cursor: pointer;
  }

  &.active {
    border-color: #fff;
    transform: scale(1.03);
  }

  &.focus {
    opacity: 0.3;
    border: 2px solid #565656;
    &:hover {
      cursor: auto;
    }
  }

  user-select: none;
  &:hover {
    cursor: pointer;
  }
`;

const InvitedFriendsButton = styled(CommonButton)`
  position: relative;
  border-color: var(--main-red-color);
  > div {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--main-red-color);
    text-align: center;
    color: var(--main-text-color);
    top: -10px;
    right: -10px;
  }
`;
export default TeamCreationPage;
