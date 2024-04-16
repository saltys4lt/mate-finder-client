import { FC, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../redux';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ClientUser from '../types/ClientUser';
import { changeFriendsInviteModalState } from '../redux/modalSlice';
import closeCross from '../assets/images/close-cross.png';
import SearchBar from './SearchBar';
import CommonButton from './UI/CommonButton';
import dropDownIcon from '../assets/images/drop-down-arrow.png';

interface ModalStatus {
  $active: string;
}

interface FriendsInviteModalProps {
  roles: string[];
}

const FriendsInviteModal: FC<FriendsInviteModalProps> = ({ roles }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFriends, setCurrentFriends] = useState<ClientUser[]>([]);
  const friends = useSelector((state: RootState) => (state.userReducer.user as ClientUser).friends);
  const friendsState = useSelector((state: RootState) => state.modalReducer.friendsInviteModalIsActive);
  const handleChangeSearchBar = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    setCurrentFriends(friends);
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      setCurrentFriends(friends.filter((friend) => friend.nickname.includes(searchQuery)));
    } else {
      setCurrentFriends(friends);
    }
  };
  return (
    <ModalContainer $active={String(friendsState)}>
      <Content>
        <InnerContent>
          {' '}
          <CloseCross
            src={closeCross}
            onClick={() => {
              dispatch(changeFriendsInviteModalState(false));
            }}
          />
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
                  currentFriends.map((friend) => (
                    <FriendsListItem key={friend.nickname}>
                      <img src={friend.cs2_data?.lvlImg} alt='' />
                      <img src={friend.user_avatar} alt='' />
                      <span>{friend.nickname}</span>
                      <DropDown>
                        <CommonButton>
                          Пригласить на роль
                          <img src={dropDownIcon} alt='' />
                        </CommonButton>
                        <DropDownContent>
                          {roles.map((role) => (
                            <DropDownButton>{role}</DropDownButton>
                          ))}
                        </DropDownContent>
                      </DropDown>
                    </FriendsListItem>
                  ))
                ) : (
                  <FriendsInviteTitle>Мы не нашли друзей с таким ником</FriendsInviteTitle>
                )}
              </FriendsList>
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
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
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
  overflow: auto;
`;

const FriendsListItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  padding: 5px 3px;
  background-color: #323232;
  > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  span {
    font-size: 16px;
    color: var(--main-text-color);
  }
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
  width: 100%;
  border-radius: 0px;
  border: 0;
  &:hover {
    color: aliceblue;
    background-color: #232323;
  }
`;

const SearchFriendsText = styled.p`
  font-size: 14px;
  color: var(--main-text-color);
  > span {
    text-decoration: underline;
    font-size: 20px;
    color: aliceblue();
  }
  cursor: pointer;
`;
