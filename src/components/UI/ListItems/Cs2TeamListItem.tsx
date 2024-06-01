import { FC } from 'react';
import styled from 'styled-components';
import CommonButton from '../CommonButton';
import { useNavigate } from 'react-router-dom';

import Team from '../../../types/Team';
import { getAgeString } from '../../../util/getAgeString';
import RoleLable from '../RoleLable';

interface ListItemProps {
  team: Team;
}

const Cs2TeamListItem: FC<ListItemProps> = ({ team }) => {
  const navigate = useNavigate();

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
      <NameAndAvatar>
        <TeamName>{team.name}</TeamName>
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
    </ListItemContainer>
  );
};

const ListItemContainer = styled.div`
  display: flex;

  align-items: center;
  column-gap: 20px;

  padding: 15px 10px;
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
  width: 100%;
  max-width: 100px;
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
      color: #df3131;
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
  width: 100px;
  height: 30px;
  font-size: 14px;
  column-gap: 5px;
  img {
    width: 17px;
    height: 17px;
  }
  &:hover {
    cursor: auto;
  }
`;

const ListItemsButtons = styled.div`
  width: 35%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
`;

export default Cs2TeamListItem;
