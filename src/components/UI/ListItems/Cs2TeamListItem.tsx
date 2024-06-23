import { FC } from 'react';
import styled from 'styled-components';
import CommonButton from '../CommonButton';
import { useNavigate } from 'react-router-dom';
import Team from '../../../types/Team';
import { getAgeString } from '../../../util/getAgeString';
import RoleLable from '../RoleLable';

import openTeamImg from '../../../assets/images/open-team-icon.png';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux';

import ClientUser from '../../../types/ClientUser';
import isDefaultAvatar from '../../../util/isDefaultAvatar';
interface ListItemProps {
  team: Team;
}

const Cs2TeamListItem: FC<ListItemProps> = ({ team }) => {
  const navigate = useNavigate();

  const friends = useSelector((state: RootState) => state.userReducer.user?.friends);

  console.log(team.members);
  const friendsInTeam: ClientUser[] | undefined = friends?.filter((friend) => team.members.some((member) => member.user.id === friend.id));
  const friendOwner: ClientUser | undefined = friends?.find((friend) => friend.id === team.userId);
  if (friendOwner) {
    friendsInTeam?.push(friendOwner);
  }

  const avgElo = Math.floor(
    ((team.user.cs2_data?.elo as number) + team.members.reduce((start, member) => (member.user.cs2_data?.elo as number) + start, 0)) /
      (team.members.length + 1),
  );
  const avgWinrate = Math.floor(
    ((team.user.cs2_data?.winrate as number) +
      team.members.reduce((start, member) => (member.user.cs2_data?.winrate as number) + start, 0)) /
      (team.members.length + 1),
  );
  const avgYears = Math.floor(
    ((team.user.age as number) + team.members.reduce((start, member) => (member.user.age as number) + start, 0)) /
      (team.members.length + 1),
  );

  return (
    <ListItemContainer>
      <FriendsRow>
        {' '}
        {friendsInTeam && (
          <>
            {friendsInTeam.slice(0, 2).map((friend) => (
              <FriendItem key={friend.id}>
                <img src={isDefaultAvatar(friend.user_avatar)} alt='' />
                <span>{friend.nickname}</span>
              </FriendItem>
            ))}
            {friendsInTeam.length > 2 && (
              <span>
                и еще {friendsInTeam.length - 2} {friendsInTeam.length - 2 === 1 ? 'друг' : 'друга'}
              </span>
            )}
          </>
        )}
      </FriendsRow>
      <ListItemInnerContainer>
        <NameAndAvatar>
          <TeamName
            onClick={() => {
              navigate(`/team/${team.name}`);
            }}
          >
            {team.name}
          </TeamName>
          <TeamAvatar
            src={team.avatar}
            onClick={() => {
              navigate(`/team/${team.name}`);
            }}
          />
        </NameAndAvatar>

        <TeamInfo>
          {' '}
          <MembersText>
            <span>
              <span>{team.members.length + 1}</span>/5
            </span>{' '}
            участников
          </MembersText>
          <p>Средние показатели: </p>
          <TeamInfoInner>
            {' '}
            <TeamDataText>
              <span> Рейтинг : </span>
              {avgElo} elo
            </TeamDataText>
            <TeamDataText>
              <span>Винрейт:</span> {avgWinrate} %
            </TeamDataText>
            <TeamDataText>
              <span>Возраст:</span> {getAgeString(avgYears)}
            </TeamDataText>
          </TeamInfoInner>
          <RolesInfoRow>
            <span>Нужные игроки</span>
            <RolesContainer>
              {team.neededRoles.length !== 0 ? (
                <RolesContainer>
                  {team.neededRoles.map((role) => (
                    <CustomRoleLabel key={role.id} role={role} />
                  ))}
                </RolesContainer>
              ) : (
                <></>
              )}
            </RolesContainer>
          </RolesInfoRow>
        </TeamInfo>
      </ListItemInnerContainer>
      <ListItemsButtons>
        <CommonButton onClick={() => navigate(`/team/${team.name}`)}>
          <img src={openTeamImg} alt='' />
          Просмотреть
        </CommonButton>
      </ListItemsButtons>
    </ListItemContainer>
  );
};
const ListItemInnerContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
`;
const ListItemContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #1f1f1f;
  border-radius: 5px;
  color: var(--main-text-color);
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

const NameAndAvatar = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  row-gap: 20px;
`;

const TeamAvatar = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid#333;
  &:hover {
    cursor: pointer;
    background-color: #333;
  }
`;
const MembersText = styled.span`
  font-size: 14px;
  font-weight: 400;
  > span {
    font-weight: 700;
    > span {
      font-size: 16px;
      color: var(--orange-color);
    }
  }
`;
const TeamName = styled.span`
  font-size: 23px;
  font-weight: 700;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  > span {
    margin-left: 15px;
    font-size: 16px;
    font-weight: 400;
  }
`;

const TeamDataText = styled.p`
  margin-left: 15px;
  font-size: 14px;
  > span {
    color: #797979;
  }
`;
const TeamInfoInner = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
`;
const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const RolesInfoRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 15px;
  > span {
    font-size: 14px;
    white-space: nowrap;
  }
`;

const RolesContainer = styled.div`
  width: 100%;

  display: flex;

  column-gap: 10px;

  flex-wrap: wrap;
  @media (max-width: 980px) {
    flex-wrap: wrap;
  }
  &:last-child {
    padding: 0;
    border: 0;
  }
`;

const CustomRoleLabel = styled(RoleLable)`
  width: 90px;
  height: 27px;
  font-size: 12px;
  column-gap: 5px;
  img {
    width: 15px;
    height: 15px;
  }
  &:hover {
    cursor: auto;
  }
`;

const FriendsRow = styled.div`
  top: 10px;
  right: 10px;
  position: absolute;
  display: flex;
  align-items: center;
  column-gap: 5px;
  > span {
    font-size: 12px;
    color: #afafaf;
  }
`;

const FriendItem = styled.div`
  display: flex;
  column-gap: 5px;
  align-items: center;
  > img {
    width: 25px;
    height: 25px;
    object-fit: cover;
    border-radius: 50%;
  }
  > span {
    font-size: 12px;
  }
`;

const ListItemsButtons = styled.div`
  display: flex;

  justify-self: flex-end;

  row-gap: 10px;
`;

export default Cs2TeamListItem;
