import { FC } from 'react';
import Team from '../types/Team';
import { PagePurposes } from '../consts/enums/PagePurposes';
import Player from '../types/Player';
import styled from 'styled-components';
import Cs2PlayerListItem from './UI/ListItems/Cs2PlayerListItem';
import Cs2TeamListItem from './UI/ListItems/Cs2TeamListItem';

interface ListContainerProps {
  data: Player[] | Team[];
  purpose: PagePurposes;
}
const List: FC<ListContainerProps> = ({ purpose, data }) => {
  if (purpose === PagePurposes.PlayersCs2) {
    const currentList: Player[] = data as Player[];

    return (
      <ListContainerBackground>
        <ListContainer>
          {currentList ? (
            currentList.map((player) => <Cs2PlayerListItem key={player.id} player={player} />)
          ) : (
            <h3 style={{ marginTop: '30px', textAlign: 'center', color: '#fff' }}>По вашему запрос ничего не найдено =\</h3>
          )}
        </ListContainer>
      </ListContainerBackground>
    );
  }

  if (purpose === PagePurposes.TeamsCs2) {
    const currentList: Team[] = data as Team[];

    return (
      <ListContainerBackground>
        <ListContainer>
          {currentList.length > 0 ? (
            currentList.map((team) => <Cs2TeamListItem key={team.id} team={team} />)
          ) : (
            <h3 style={{ marginTop: '30px', textAlign: 'center', color: '#fff' }}>По вашему запрос ничего не найдено =\</h3>
          )}
        </ListContainer>
      </ListContainerBackground>
    );
  }
};

const ListContainerBackground = styled.div`
  background-color: #2f2f2f;
  height: 900px;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
`;
const ListContainer = styled.div`
  background-color: #2f2f2f;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  padding-inline: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 13px;
    border-radius: 20px;
  }

  &::-webkit-scrollbar-track {
    background-color: #565656;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #707070;
    border-radius: 10px;
  }
`;

export default List;
