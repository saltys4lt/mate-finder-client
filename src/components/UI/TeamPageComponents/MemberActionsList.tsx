import { useState } from 'react';
import { useTransition, animated } from '@react-spring/web';
import styled from 'styled-components';
import editIcon from '../../../assets/images/edit.png';
import kickPlayerIcon from '../../../assets/images/remove-player.png';
import changeRoleIcon from '../../../assets/images/switch-role.png';

const Container = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
`;

const TriggerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;

  &:hover {
    cursor: pointer;
  }
`;

const Trigger = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50px;
  text-align: center;
  background-color: #494949;
  padding: 3px;
  > img {
    width: 100%;
    max-width: 25px;
    max-height: 25px;

    object-fit: contain;

    filter: invert(0.8);
  }
  &:hover {
    cursor: pointer;
  }
`;

const ListContainer = styled(animated.div)`
  width: 200px;
  position: absolute;
  left: 30px;
  top: 0;
  background-color: #202020;
  padding: 10px;
  border: 1px solid #3f3f3f;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ActionsList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
`;

const ActionsListItem = styled.li`
  width: 100%;
  column-gap: 10px;
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 3px;
  img {
    width: 25px;
    height: 25px;
    filter: invert(0.8);
  }

  &:hover {
    background-color: #575757;
  }
`;

const MemberActionsList = () => {
  const [showList, setShowList] = useState(false);

  const transitions = useTransition(showList, {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    enter: { transform: 'translateX(0)', opacity: 1 },
    leave: { transform: 'translateX(-20px)', opacity: 0 },
    config: { tension: 220, friction: 20 },
  });

  return (
    <Container>
      <TriggerContainer onMouseEnter={() => setShowList(true)} onMouseLeave={() => setShowList(false)}>
        <Trigger>
          <img src={editIcon} alt='' />
        </Trigger>
        {transitions(
          (styles, item) =>
            item && (
              <ListContainer style={styles}>
                <ActionsList>
                  <ActionsListItem>
                    Изменить роль <img src={changeRoleIcon} alt='' />
                  </ActionsListItem>
                  <ActionsListItem>
                    Выгнать <img src={kickPlayerIcon} alt='' />
                  </ActionsListItem>
                </ActionsList>
              </ListContainer>
            ),
        )}
      </TriggerContainer>
    </Container>
  );
};

export default MemberActionsList;
