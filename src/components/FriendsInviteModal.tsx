import { FC, ChangeEvent, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../redux';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ClientUser from '../types/ClientUser';
import { changeFriendsInviteModalState, changeInvitedFriendsModalState } from '../redux/modalSlice';
import closeCross from '../assets/images/close-cross.png';
import SearchBar from './SearchBar';
import CommonButton from './UI/CommonButton';
import groupInviteIcon from '../assets/images/group-invite.png';
import cancelInviteIcon from '../assets/images/cancel-invite.png';
import Cookies from 'js-cookie';
import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';
import ConfirmButton from './UI/ConfirmButton';
import { FriendWithRole } from '../types/FriendWithRole';
import Swal from 'sweetalert2';
import isDefaultAvatar from '../util/isDefaultAvatar';
import { sendTeamRequest } from '../api/teamRequsts.ts/sendTeamRequest';
import { TeamRequest } from '../types/TeamRequest';
import rolesIcons from '../consts/rolesIcons';

interface ModalStatus {
  $active: string;
}

interface FriendsInviteModalProps {
  ownerRole: string;
  invitedFriends: FriendWithRole[];
  setInvitedFriends: (friends: FriendWithRole[]) => void;
  roles: string[];
  setRoles: (role: string[]) => void;
  teamId?: number;
  membersIds?: number[];
}

const FriendsInviteModal: FC<FriendsInviteModalProps> = ({
  roles,
  ownerRole,
  invitedFriends,
  setInvitedFriends,
  setRoles,
  teamId,
  membersIds,
}) => {
  const isEditMode: string | undefined = Cookies.get('tem');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState<boolean>(false);
  const friends = useSelector((state: RootState) => (state.userReducer.user as ClientUser).friends);
  const friendsState = useSelector((state: RootState) => state.modalReducer.friendsInviteModalIsActive);
  const invitedFriendsState = useSelector((state: RootState) => state.modalReducer.invitedFriendsModalIsActive);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFriends, setCurrentFriends] = useState<ClientUser[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendWithRole | null>(null);
  const [otherRoles, setOtherRoles] = useState<string[]>([]);
  const handleChangeSearchBar = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (friends) {
      let friendsList = friends.filter((friend) => !invitedFriends.find((iFriend) => iFriend.id === friend.id));

      if (membersIds) {
        friendsList = friendsList.filter((friend) => !membersIds.find((memberId) => memberId === friend.id));
      }
      setCurrentFriends(friendsList);
    }
  }, [friends, membersIds]);

  useLayoutEffect(() => {
    if (friendsState || invitedFriendsState) {
      setIsActive(true);
    }
  }, [friendsState, invitedFriendsState]);

  useEffect(() => {
    setOtherRoles(
      Cs2PlayerRoles.filter((role) => roles.find((neededRole) => neededRole === role.name))
        .filter((role) => role.name !== ownerRole)
        .map((role) => role.name),
    );
  }, [roles, ownerRole]);

  const handleSearch = () => {
    if (searchQuery) {
      setCurrentFriends(friends.filter((friend) => friend.nickname.includes(searchQuery)));
    } else {
      setCurrentFriends(friends);
    }
  };

  const changeSelectedFriendRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const role = Cs2PlayerRoles.find((role) => role.name === e.target.value);
    setSelectedFriend({ ...(selectedFriend as FriendWithRole), role });
  };

  const selectedFriendRoleState = (role: string) => {
    return selectedFriend?.role?.name === role ? 'active' : '';
  };
  const backFromSelectedFriend = () => {
    setSelectedFriend(null);
  };

  const addInvitedFriend = () => {
    setInvitedFriends([...(invitedFriends as FriendWithRole[]), selectedFriend as FriendWithRole]);
    setRoles([...roles, selectedFriend?.role?.name as string]);
    setSelectedFriend(null);
    if (roles.length === 3 || invitedFriends.length + 1 === friends.length) {
      dispatch(changeFriendsInviteModalState(false));
      setIsActive(false);
    }
    if (teamId) {
      if (selectedFriend) {
        const roleId: number = selectedFriend?.role?.id as number;
        if (roleId) {
          const newReq: TeamRequest = { roleId, teamId, toUserId: selectedFriend?.id as number, isFromTeam: true };
          sendTeamRequest(newReq);
        }
      }
    }
  };

  return (
    <ModalContainer $active={String(isActive)}>
      <Content>
        <InnerContent>
          {' '}
          <CloseCross
            src={closeCross}
            onClick={() => {
              setIsActive(false);
              if (invitedFriendsState) {
                setTimeout(() => {
                  dispatch(changeInvitedFriendsModalState(false));
                }, 300);
              } else {
                setTimeout(() => {
                  dispatch(changeFriendsInviteModalState(false));
                }, 300);
              }

              setTimeout(() => {
                setSelectedFriend(null);
              }, 300);
            }}
          />
          {invitedFriendsState && (
            <>
              {isEditMode && <h3 style={{ color: 'var(--main-text-color)' }}>Приглашенные игроки</h3>}
              <FriendsList>
                {invitedFriends.map((friend, _, arr) => (
                  <FriendsListItem key={friend.nickname}>
                    <FriendItemData>
                      <ProfileData>
                        <InvitedPlayerAvatar src={isDefaultAvatar(friend.user_avatar)} alt='' />
                        <span>{friend.nickname}</span>
                        <InvitedPlayerLvl src={friend.lvlImg} alt='' />
                      </ProfileData>
                      <RoleLabelContainer>
                        <span>Роль: </span>
                        <InvitedPlayerRoleLabel key={friend.role?.id}>
                          <img src={rolesIcons.get(friend.role?.id as number)} alt='' />
                          {friend.role?.name as string}
                        </InvitedPlayerRoleLabel>
                      </RoleLabelContainer>
                    </FriendItemData>

                    {!isEditMode ? (
                      <CommonButton
                        onClick={() => {
                          setInvitedFriends(arr.filter((arrItem) => arrItem.nickname !== friend.nickname));
                          setRoles(roles.filter((role) => role !== (friend.role?.name as string)));
                          if (invitedFriends.length - 1 === 0) {
                            Swal.fire({
                              titleText: 'Все приглашения отменены',

                              confirmButtonText: 'Понятно',
                              timer: 4000,
                              timerProgressBar: true,
                            });
                            dispatch(changeInvitedFriendsModalState(false));
                            setIsActive(false);
                          }
                        }}
                      >
                        Отменить
                        <img src={cancelInviteIcon} alt='' />
                      </CommonButton>
                    ) : (
                      <CommonButton
                        onClick={() => {
                          setInvitedFriends(arr.filter((arrItem) => arrItem.id !== friend.id));
                          setRoles(roles.filter((role) => role !== (friend.role?.name as string)));
                          if (invitedFriends.length - 1 === 0) {
                            Swal.fire({
                              titleText: 'Все приглашения отменены',

                              confirmButtonText: 'Понятно',
                              timer: 4000,
                              timerProgressBar: true,
                            });
                            dispatch(changeInvitedFriendsModalState(false));
                            setIsActive(false);
                          }
                        }}
                      >
                        Отменить
                        <img src={cancelInviteIcon} alt='' />
                      </CommonButton>
                    )}
                  </FriendsListItem>
                ))}
              </FriendsList>
            </>
          )}
          {friendsState && (
            <>
              {friends.length === 0 ? (
                <>
                  <FriendsInviteTitle>
                    Ваш список друзей пуст <span style={{ color: '#000000' }}>😥</span>
                  </FriendsInviteTitle>
                  <SearchFriendsText>
                    Но найти их можно{' '}
                    <span
                      onClick={() => {
                        dispatch(changeFriendsInviteModalState(false));
                        navigate('/players');
                      }}
                    >
                      тут!
                    </span>
                  </SearchFriendsText>
                </>
              ) : selectedFriend ? (
                <SelectedFriendContainer>
                  <SelectedFriendTitle>
                    <span>Выберите роль для</span>
                    <div>
                      <img src={isDefaultAvatar(selectedFriend.user_avatar)} alt='' />
                      <span>{selectedFriend.nickname}</span>
                    </div>
                  </SelectedFriendTitle>
                  <RolesContainer>
                    {otherRoles.map((role, index) => (
                      <RoleCard key={role}>
                        <RoleCheckbox
                          id={(index + 20).toString()}
                          onChange={(e) => changeSelectedFriendRole(e)}
                          value={role}
                          type='checkbox'
                        />
                        <RoleLabel className={selectedFriendRoleState(role)} htmlFor={(index + 20).toString()}>
                          <img src={rolesIcons.get(Cs2PlayerRoles.find((cs2role) => cs2role.name === role)?.id as number)} alt='' />
                          {role}
                        </RoleLabel>
                      </RoleCard>
                    ))}
                  </RolesContainer>
                  <StepButtons>
                    <StepButton onClick={backFromSelectedFriend}>отмена</StepButton>

                    <StepButton $isDisabled={!selectedFriend.role} disabled={!selectedFriend.role} onClick={addInvitedFriend}>
                      Подтвердить
                    </StepButton>
                  </StepButtons>
                </SelectedFriendContainer>
              ) : (
                <>
                  <FriendsInviteTitle>Ваши друзья</FriendsInviteTitle>
                  <SearchBar
                    inputFunc={handleChangeSearchBar}
                    inputValue={searchQuery}
                    buttonWidth='30%'
                    inputWidth='70%'
                    inputPlaceholder='Никнейм друга'
                    buttonText='Поиск'
                    buttonFunc={handleSearch}
                    ComponentHeight='30px'
                  />
                  <FriendsList>
                    {currentFriends.length !== 0 ? (
                      currentFriends.map(
                        (friend) =>
                          !invitedFriends.find((invFriend) => invFriend.nickname === friend.nickname) && (
                            <FriendsListItem key={friend.nickname}>
                              <img src={friend.cs2_data?.lvlImg} alt='' />
                              <img src={isDefaultAvatar(friend.user_avatar as string)} alt='' />
                              <span>{friend.nickname}</span>

                              <CommonButton
                                onClick={() => {
                                  setSelectedFriend({
                                    id: friend.id,
                                    nickname: friend.nickname,
                                    user_avatar: friend.user_avatar as string,
                                  });
                                }}
                              >
                                Пригласить
                                <img src={groupInviteIcon} alt='' />
                              </CommonButton>
                            </FriendsListItem>
                          ),
                      )
                    ) : (
                      <FriendsInviteTitle>Мы не нашли друзей с таким ником</FriendsInviteTitle>
                    )}
                  </FriendsList>
                </>
              )}
            </>
          )}
        </InnerContent>
      </Content>
    </ModalContainer>
  );
};

export default FriendsInviteModal;

const ModalContainer = styled.div<ModalStatus>`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${(p) => (p.$active == 'false' ? 0 : 1)};
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: ${(p) => (p.$active == 'false' ? 'none' : 'all')};
  transition: opacity 0.2s ease-in-out;
  z-index: 2;
`;

const Content = styled.div`
  position: relative;
  display: flex;

  padding: 20px;
  border-radius: 12px;
  background-color: #393939;
  width: 500px;
  min-height: 200px;

  max-height: 600px;
  transition: all 0.2s ease-in-out;
`;
const InnerContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
`;
const CloseCross = styled.img`
  padding-right: 10px;
  padding-top: 10px;
  display: block;
  width: 25px;
  height: 25px;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  filter: invert(0.8);
  &:hover {
    transform: scale(1.1);
  }
`;
const FriendsInviteTitle = styled.h3`
  color: var(--main-text-color);
  font-size: 18px;
`;

const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 200px;
  row-gap: 15px;
  border-radius: 10px;
  padding: 5px;
  overflow-y: auto;
  margin-top: 30px;
`;

const FriendsListItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: space-between;
  padding: 10px 25px;
  position: relative;
  background-color: #1c1c1c;

  border-radius: 5px;
  > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  span {
    font-size: 16px;
    color: var(--main-text-color);
  }
`;

const FriendItemData = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const ProfileData = styled.div`
  display: flex;
  column-gap: 5px;
  align-items: center;
  background-color: #1c1c1c;
  border-radius: 5px;
  padding: 5px;
  > span {
    font-size: 18px;
  }
`;

const InvitedPlayerAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const InvitedPlayerLvl = styled(InvitedPlayerAvatar)`
  height: 30px;
  width: 30px;
`;

const RoleLabelContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 5px;
`;

const SearchFriendsText = styled.p`
  font-size: 14px;
  color: var(--main-text-color);
  > span {
    text-decoration: underline;
    font-size: 20px;
    color: aliceblue;
  }
  cursor: pointer;
`;
const SelectedFriendContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 300px;
`;
const SelectedFriendTitle = styled(FriendsInviteTitle)`
  > div {
    margin-top: 10px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    column-gap: 10px;
    > span {
      font-size: 18px;
      font-weight: 400;
    }
    > img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
`;
const StepButtons = styled.div`
  display: flex;
  align-items: center;
  column-gap: 30px;
`;

const RolesContainer = styled.div`
  display: flex;
  width: 100%;
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

const InvitedPlayerRoleLabel = styled.label`
  border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;
  display: flex;
  column-gap: 10px;
  align-items: center;
  justify-content: center;
  width: 130px;
  text-align: center;
  font-size: 16px;
  color: #d1cfcf;
  user-select: none;
  > img {
    object-fit: cover;
    filter: invert(0.5);
    display: block;
    width: 20px;
    height: 20px;
  }
`;

const RoleLabel = styled.label`
  border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 130px;
  text-align: center;
  font-size: 16px;
  color: #d1cfcf;
  column-gap: 10px;
  img {
    display: block;
    width: 20px;
    height: 20px;
    object-fit: cover;
    filter: invert(0.5);
  }
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

const StepButton = styled(ConfirmButton)<{ $isDisabled: boolean }>`
  font-size: 16px;
  opacity: ${(p) => (p.$isDisabled ? '0.3' : '1')};
  cursor: ${(p) => (p.$isDisabled ? 'auto' : 'pointer')};
  &:hover {
    background-color: ${(p) => p.$isDisabled && '#000'};
  }
`;
