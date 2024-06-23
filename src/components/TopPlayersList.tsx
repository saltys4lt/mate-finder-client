import { FC, useEffect } from 'react';
import { RootState, useAppDispatch } from '../redux';
import { useSelector } from 'react-redux';
import fetchTopPlayers from '../redux/playerThunks/fetchTopPlayers';
import Loader from './Loader';
import styled from 'styled-components';
import isDefaultAvatar from '../util/isDefaultAvatar';
import { useNavigate } from 'react-router-dom';

interface TopPlayersList {
  id: number;
}

const TopPlayersList: FC<TopPlayersList> = ({ id }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const topPlayers = useSelector((state: RootState) => state.playerReducer.topPlayers);
  useEffect(() => {
    dispatch(fetchTopPlayers());
  }, []);

  const openPlayerProfile = (nickname: string) => {
    navigate(`/profile/${nickname}`);
  };

  return topPlayers ? (
    <TopList>
      <h3> Топ игроков 🏆</h3>
      <TopPlayersContainer>
        {topPlayers.map((player) => (
          <TopPlayerItem
            key={player.id}
            onClick={() => {
              openPlayerProfile(player.nickname);
            }}
          >
            <TopPlayerItemData>
              {' '}
              <img src={isDefaultAvatar(player.user_avatar)} alt='' />
              {player.id === id ? (
                <span>
                  <strong>{player.nickname} (ВЫ)</strong>
                </span>
              ) : (
                <span>{player.nickname}</span>
              )}
            </TopPlayerItemData>

            <LvlContainer>
              <img src={player.cs2_data?.lvlImg} alt='' />
              <span>{player.cs2_data?.elo} elo</span>
            </LvlContainer>
          </TopPlayerItem>
        ))}
      </TopPlayersContainer>
    </TopList>
  ) : (
    <Loader />
  );
};

const TopList = styled.div`
  color: var(--main-text-color);
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const TopPlayersContainer = styled.div`
  width: 100%;
  max-width: 445px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  background-color: #1f1f1f;
  padding: 5px 10px;
`;

const TopPlayerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #393939;
  &:hover {
    cursor: pointer;
    background-color: #4f4f4f;
  }
`;

const TopPlayerItemData = styled.div`
  display: flex;
  align-items: center;
  column-gap: 15px;
  > span {
    font-size: 14px;
  }
  > img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    object-fit: cover;
  }
`;

const LvlContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 5px;
  color: #979797;
  font-weight: 300;
  > img {
    width: 35px;
  }
`;

export default TopPlayersList;
