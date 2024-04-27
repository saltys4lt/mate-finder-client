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

import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';
import ConfirmButton from './UI/ConfirmButton';
import { FriendWithRole } from '../types/FriendWithRole';
import Swal from 'sweetalert2';

interface ModalStatus {
  $active: string;
}

interface FriendsInviteModalProps {
  ownerRole: string;
  invitedFriends: FriendWithRole[];
  setInvitedFriends: (friends: FriendWithRole[]) => void;
  roles: string[];
  setRoles: (role: string[]) => void;
}

const FriendsInviteModal: FC<FriendsInviteModalProps> = ({ roles, ownerRole, invitedFriends, setInvitedFriends, setRoles }) => {
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
    setCurrentFriends(friends);
  }, [friends]);

  useLayoutEffect(() => {
    if (friendsState || invitedFriendsState) {
      setIsActive(true);
    }
  }, [friendsState, invitedFriendsState]);

  useEffect(() => {
    setOtherRoles(
      Cs2PlayerRoles.filter((role) => !roles.find((neededRole) => neededRole === role.name))
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
    setSelectedFriend({ ...(selectedFriend as FriendWithRole), role: e.target.value });
  };

  const selectedFriendRoleState = (role: string) => {
    return selectedFriend?.role === role ? 'active' : '';
  };
  const backFromSelectedFriend = () => {
    setSelectedFriend(null);
  };

  const addInvitedFriend = () => {
    setInvitedFriends([...(invitedFriends as FriendWithRole[]), selectedFriend as FriendWithRole]);
    setRoles([...roles, selectedFriend?.role as string]);
    setSelectedFriend(null);
    if (roles.length === 3 || invitedFriends.length + 1 === friends.length) {
      dispatch(changeFriendsInviteModalState(false));
      setIsActive(false);
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
              <FriendsList>
                {invitedFriends.map((friend, _, arr) => (
                  <FriendsListItem key={friend.nickname}>
                    <img src={friend.user_avatar} alt='' />
                    <span>{friend.nickname}</span>
                    <span>{friend.role as string}</span>

                    <CommonButton
                      onClick={() => {
                        setInvitedFriends(arr.filter((arrItem) => arrItem.nickname !== friend.nickname));
                        setRoles(roles.filter((role) => role !== (friend.role as string)));
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
                      тут
                    </span>
                  </SearchFriendsText>
                </>
              ) : selectedFriend ? (
                <SelectedFriendContainer>
                  <SelectedFriendTitle>
                    <span>Выберите роль для</span>
                    <div>
                      <img src={selectedFriend.user_avatar} alt='' />
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
                              <img src={friend.user_avatar} alt='' />
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
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  display: flex;

  padding: 20px;
  border-radius: 12px;
  background-color: #393939;
  width: 430px;
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
`;

const FriendsListItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: space-between;
  padding: 5px 25px;
  position: relative;
  background-color: #323232;
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

const StepButton = styled(ConfirmButton)<{ $isDisabled: boolean }>`
  font-size: 16px;
  opacity: ${(p) => (p.$isDisabled ? '0.3' : '1')};
  cursor: ${(p) => (p.$isDisabled ? 'auto' : 'pointer')};
  &:hover {
    background-color: ${(p) => p.$isDisabled && '#000'};
  }
`;
