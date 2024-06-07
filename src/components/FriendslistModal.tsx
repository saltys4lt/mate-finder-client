import React, { ChangeEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SearchBar from './SearchBar';
import closeCross from '../assets/images/close-cross.png';
import { changeFriendsModalState } from '../redux/modalSlice';
import ClientUser from '../types/ClientUser';
import isDefaultAvatar from '../util/isDefaultAvatar';
interface ModalStatus {
  $active: string;
}
const FriendslistModal = () => {
  const friends = useSelector((state: RootState) => state.userReducer.user?.friends);
  const isActive = useSelector((state: RootState) => state.modalReducer.friendsModal);
  const [currentFriends, setCurrentFriends] = useState<ClientUser[]>(friends || []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleClose = () => {
    dispatch(changeFriendsModalState(false));
    setSearchQuery('');
    setTimeout(() => {
      if (friends) {
        setCurrentFriends(friends);
      }
    }, 300);
  };

  const filterList = () => {
    if (friends) setCurrentFriends(friends?.filter((friend) => friend.nickname.includes(searchQuery)));
  };
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openProfile = (nickname: string) => {
    dispatch(changeFriendsModalState(false));
    navigate(`/profile/${nickname}`);
  };
  return (
    <ModalContainer $active={String(isActive)}>
      <Content>
        <InnerContent>
          <CloseCross src={closeCross} onClick={handleClose} />
          {friends?.length !== 0 ? (
            <FriendsContent>
              <SearchBar
                inputValue={searchQuery}
                buttonText='Поиск'
                inputPlaceholder='Ник друга'
                buttonFunc={filterList}
                inputFunc={handleInput}
                ComponentHeight='40px'
                inputWidth='300px'
                buttonWidth='100px'
              />
              <FriendsContainer>
                {currentFriends && (
                  <>
                    {currentFriends.length > 0 ? (
                      <>
                        {currentFriends.map((friend) => (
                          <FriendsItem key={friend.id} onClick={() => openProfile(friend.nickname)}>
                            <FriendData>
                              <span>{friend.nickname}</span>
                              <img src={isDefaultAvatar(friend.user_avatar)} alt='' />
                            </FriendData>
                          </FriendsItem>
                        ))}
                      </>
                    ) : (
                      <FriendsInviteTitle style={{ textAlign: 'center' }}>
                        Мы никого не нашли<span style={{ color: '#000000' }}>😥</span>
                      </FriendsInviteTitle>
                    )}
                  </>
                )}
              </FriendsContainer>
            </FriendsContent>
          ) : (
            <>
              <FriendsInviteTitle>
                Ваш список друзей пуст <span style={{ color: '#000000' }}>😥</span>
              </FriendsInviteTitle>
              <SearchFriendsText>
                Но найти их можно{' '}
                <span
                  onClick={() => {
                    dispatch(changeFriendsModalState(false));
                    navigate('/players');
                  }}
                >
                  тут!
                </span>
              </SearchFriendsText>
            </>
          )}
        </InnerContent>
      </Content>
    </ModalContainer>
  );
};
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
  padding-top: 35px;
  border-radius: 12px;
  background-color: #393939;
  width: 600px;
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

const FriendsContent = styled.div`
  display: flex;

  flex-direction: column;
  row-gap: 20px;
`;

const FriendsContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-self: self-start;
`;
const FriendsItem = styled.div`
  min-width: 100px;

  background-color: #1f1f1f;
  border-radius: 5px;
  padding: 5px 9px;

  &:hover {
    cursor: pointer;
    background-color: #282828;
  }
`;

const FriendData = styled.div`
  color: var(--main-text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 5px;
  > span {
    font-size: 14px;
  }
  > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export default FriendslistModal;
