import { FC } from 'react';
import styled from 'styled-components';
import Player from '../../../types/Player';
import MapsImages from '../../../consts/MapsImages';
import { getAgeString } from '../../../util/getAgeString';
import CommonButton from '../CommonButton';
import { useNavigate } from 'react-router-dom';

import { RootState, useAppDispatch } from '../../../redux';
import { changeChatState } from '../../../redux/modalSlice';
import { useSelector } from 'react-redux';
import { setCurrentChat } from '../../../redux/chatSlice';
import { Chat } from '../../../types/Chat';
import ClientUser from '../../../types/ClientUser';
import userDefaultAvatar from '../../../assets/images/default-avatar.png';
import { sendFriendRequest } from '../../../api/friendsRequests/sendFriendRequest';
import addFriendIcon from '../../../assets/images/add-friend.png';
import sendedFriendReq from '../../../assets/images/sended-friend-req.png';
import sendMessage from '../../../assets/images/send-message.png';
import inFriendsIcon from '../../../assets/images/in-friends-icon.png';

interface ListItemProps {
  player: Player;
}

const Cs2PlayerListItem: FC<ListItemProps> = ({ player }) => {
  const user = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const chats = useSelector((state: RootState) => state.chatReducer.chats);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const sendRequest = (playerId: number) => {
    sendFriendRequest({ fromUserId: user.id, toUserId: playerId });
  };
  const handleChatOpen = () => {
    dispatch(changeChatState(true));

    const openedChat = {
      roomId: user.id.toString() + player.id.toString(),
      members: [
        {
          user_avatar: player.user_avatar,
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
      team: false,
    } as Chat;

    const chat: Chat | undefined = chats?.find(
      (chat) => chat.members.find((member) => member.id === user.id) && chat.members.find((member) => member.id === player.id),
    );
    if (chat) {
      dispatch(setCurrentChat(chat));
    } else dispatch(setCurrentChat(openedChat));
  };

  return (
    <ListItemContainer
      onClick={() => {
        navigate(`/profile/${player.nickname}`);
      }}
    >
      <PlayerInfo>
        <PlayerInfoHeader>
          <PlayerLvl src={player.cs2_data?.lvlImg} />
          <PlayerNickname>{player.nickname}</PlayerNickname>

          <PlayerAge>
            {getAgeString(player.age)}, пол: {player.gender === 'male' ? 'Мужской' : 'Женский'}
          </PlayerAge>
          {user.friends.find((friend) => friend.id === player.id) && (
            <InFriendLabel>
              <img src={inFriendsIcon} alt='' />
              Ваш друг
            </InFriendLabel>
          )}
        </PlayerInfoHeader>
        <PlayerInfoInner>
          <PlayerAvatar src={player.user_avatar ? player.user_avatar : userDefaultAvatar} />
          <PlayerStats>
            <PlayerStatsText>
              ELO: <PlayerStatsTextSpan>{player.cs2_data?.elo}</PlayerStatsTextSpan>
            </PlayerStatsText>
            <PlayerStatsText>
              КД: <PlayerStatsTextSpan>{player.cs2_data?.kd}</PlayerStatsTextSpan>
            </PlayerStatsText>
            <PlayerStatsText>
              Процент убийств в голову: <PlayerStatsTextSpan>{player.cs2_data?.hs}%</PlayerStatsTextSpan>
            </PlayerStatsText>

            <PlayerStatsText>
              Процент побед: <PlayerStatsTextSpan>{player.cs2_data?.winrate}%</PlayerStatsTextSpan>
            </PlayerStatsText>
            <PlayerStatsText>
              Всего матчей: <PlayerStatsTextSpan>{player.cs2_data?.matches}</PlayerStatsTextSpan>
            </PlayerStatsText>
            <PlayerStatsText>
              Побед: <PlayerStatsTextSpan>{player.cs2_data?.wins}</PlayerStatsTextSpan>
            </PlayerStatsText>
          </PlayerStats>
        </PlayerInfoInner>
        <RolesContainer>
          <PlayerStatsText>Роли:</PlayerStatsText>
          <Roles>{player?.cs2_data?.roles?.map((role) => <Role key={role.cs2Role.name}>{role.cs2Role.name}</Role>)}</Roles>
        </RolesContainer>
        <MapsContainer>
          <PlayerStatsText>Карты:</PlayerStatsText>
          <Maps>{player?.cs2_data?.maps?.map((map) => <img key={MapsImages[map.cs2Map.name]} src={MapsImages[map.cs2Map.name]} />)}</Maps>
        </MapsContainer>
      </PlayerInfo>
      <ListItemsButtons>
        <Cs2ItemButton
          onClick={(e) => {
            e.stopPropagation();
            handleChatOpen();
          }}
        >
          <img src={sendMessage} alt='' />
          Написать сообщение
        </Cs2ItemButton>

        {user.sentRequests.find((req) => req.fromUserId === user.id && req.toUserId === player.id) ? (
          <Cs2ItemButton
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img src={sendedFriendReq} alt='' />
            Запрос отправлен
          </Cs2ItemButton>
        ) : user.receivedRequests.find((req) => req.toUserId === user.id && req.fromUserId === player.id) ? (
          <Cs2ItemButton
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img src={sendedFriendReq} alt='' />
            Ждет вашего ответа
          </Cs2ItemButton>
        ) : user.friends.find((friend) => friend.id === player.id) ? (
          <></>
        ) : (
          <Cs2ItemButton
            onClick={(e) => {
              e.stopPropagation();
              sendRequest(player.id);
            }}
          >
            <img src={addFriendIcon} alt='' />
            Добавить в друзья
          </Cs2ItemButton>
        )}
      </ListItemsButtons>
    </ListItemContainer>
  );
};

const ListItemContainer = styled.div`
  display: flex;

  align-items: center;
  column-gap: 20px;
  width: 100%;
  justify-content: space-between;
  padding: 15px 10px;
  background-color: #1f1f1f;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
  animation: fadeInOut 0.3s ease-in-out;
  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(40px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
const InFriendLabel = styled(CommonButton)`
  &:hover {
    background-color: #181818;
    border-color: #565656;
  }
`;
const Cs2ItemButton = styled(CommonButton)`
  &:hover {
    opacity: 1;
    background-color: #2b2b2b;
  }
`;
const PlayerAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;
const PlayerInfoInner = styled.div`
  display: flex;
  align-items: center;
  padding-block: 10px;
  column-gap: 20px;
`;
const PlayerInfo = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
`;

const PlayerInfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const PlayerNickname = styled.p`
  margin-left: 7px;
  color: #fff;
  font-size: 18px;
`;
const PlayerLvl = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const PlayerStats = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  column-gap: 30px;
  row-gap: 10px;
  flex-wrap: wrap;
`;
const PlayerStatsText = styled.p`
  color: #9f9f9f;
  font-size: 14px;
  white-space: nowrap;
`;
const PlayerStatsTextSpan = styled.span`
  color: #cacaca;
  font-size: 15px;
  font-weight: 700;
`;

const PlayerAge = styled.p`
  color: #e0e0e0;
  font-size: 14px;
  margin-left: 10px;
`;

const RolesContainer = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
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

const MapsContainer = styled(RolesContainer)``;

const Maps = styled(Roles)`
  img {
    width: 70px;
    border-radius: 5px;
  }
`;

const ListItemsButtons = styled.div`
  width: 35%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;

export default Cs2PlayerListItem;
