import { useState } from 'react';
import styled from 'styled-components';
import { SteamAuth } from '../util/steamAuth';
import { RootState, useAppDispatch } from '../redux';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { ConfirmButton } from './UI/ConfirmButton';
const GameChoiceForm = () => {
  const [game, setGame] = useState<{ cs2: boolean; valorant: boolean }>({
    cs2: false,
    valorant: false,
  });

  const csData = useSelector(
    (state: RootState) => state.userReducer.user?.csgo_data,
  );
  const pickGame = (selectedGame: 'cs2' | 'valorant') => {
    if (selectedGame === 'cs2') setGame({ valorant: false, cs2: true });
    else setGame({ valorant: true, cs2: false });
  };

  const handleConfirm = () => {
    if (csData) {
      Swal.fire({
        icon: 'question',
        title: `Что-то пошло не так`,
        text: `Похоже вы уже подключили свой faceit аккаунт`,
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    if (game.cs2) {
      SteamAuth();
    }
  };

  return (
    <ModalContainer>
      <h3>Choose a game</h3>
      <GamesContainer>
        <GameItem
          $isActive={String(game.valorant)}
          onClick={() => pickGame('valorant')}
        >
          <GameIcon src='/images/valorantLogo.png' />
          <p>Valorant</p>
        </GameItem>
        <GameItem $isActive={String(game.cs2)} onClick={() => pickGame('cs2')}>
          <GameIcon src='/images/cs2-logo.png' />
          <p>Counter-Strike 2</p>
        </GameItem>
      </GamesContainer>

      <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>
      <AttentionText>
        <span>Важно!</span> Ваш steam обязательно должен быть привязан к faceit,
        а также на этом аккаунте должно быть сыграно миннимум 3 игры
      </AttentionText>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GamesContainer = styled.div`
  padding: 20px 30px;
  display: flex;
  column-gap: 20px;
  align-items: center;
`;

const GameIcon = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  transition: opacity 0.2s ease-in-out;
`;

const GameItem = styled.div<{ $isActive: string }>`
  padding: 20px;

  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #333;
    transform: ${(props) => (props.$isActive === 'false' ? 'scale(1.05)' : '')};
  }

  &:hover ${GameIcon} {
    opacity: 0.5;
  }

  background-color: ${(props) => (props.$isActive === 'true' ? '#333' : '')};
  transform: ${(props) => (props.$isActive === 'true' ? 'scale(1.1)' : '')};

  & ${GameIcon} {
    opacity: ${(props) => (props.$isActive === 'true' ? 0.5 : 1)};
  }

  & p {
    font-size: 12px;
  }
`;

const AttentionText = styled.p`
  margin-top: 20px;
  max-width: 90%;
  text-align: center;
  font-size: 12px;
  span {
    color: #b92727;
    font-size: 14px;
    font-weight: bold;
  }
`;

export default GameChoiceForm;
