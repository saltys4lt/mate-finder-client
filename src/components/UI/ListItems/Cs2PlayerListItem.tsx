import { FC } from 'react';
import styled from 'styled-components';
import Player from '../../../types/Player';
import MapsImages from '../../../consts/MapsImages';
import { getAgeString } from '../../../util/getAgeString';

interface ListItemProps {
  player: Player;
}

const Cs2PlayerListItem: FC<ListItemProps> = ({ player }) => {
  return (
    <ListItemContainer>
      <PlayerInfo>
        <PlayerInfoHeader>
          <PlayerLvl src={player.cs2_data?.lvlImg} />
          <PlayerNickname>{player.nickname}</PlayerNickname>

          <PlayerAge>
            {getAgeString(player.age)}, пол: {player.gender === 'male' ? 'Мужской' : 'Женский'}
          </PlayerAge>
        </PlayerInfoHeader>
        <PlayerInfoInner>
          <PlayerAvatar src={player.user_avatar ? player.user_avatar : '/images/default-avatar.png'} />
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
    </ListItemContainer>
  );
};

const ListItemContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  width: 100%;

  padding: 15px 10px;
  background-color: #1f1f1f;
  border-radius: 5px;
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
  width: 100%;
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
  width: 60%;
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

export default Cs2PlayerListItem;
