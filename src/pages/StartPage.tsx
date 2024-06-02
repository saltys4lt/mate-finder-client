import styled from 'styled-components';
import Modal from '../components/Modal';
import { useAppDispatch } from '../redux';
import { changeRegState } from '../redux/modalSlice';
import improveIcon from '../assets/images/improve.png';
import matesIcon from '../assets/images/mates.png';
import uniteIcon from '../assets/images/unite.png';
import startPageBg from '../assets/images/start-page-bg.jpg';
const StartPage = () => {
  const dispatch = useAppDispatch();

  const openRegModal = () => {
    document.documentElement.style.overflowY = 'hidden';
    dispatch(changeRegState(true));
  };

  return (
    <>
      <Modal />
      <Main>
        <ContentContainer>
          <Content>
            <ContentTitle>новый геймплей начинается здесь</ContentTitle>
            <div style={{ marginTop: '80px' }}>
              <SubContent>
                <SubContentRed>Находи</SubContentRed> нужных людей
                <ContentIcon src={matesIcon}></ContentIcon>
              </SubContent>
              <SubContent>
                <SubContentRed>Объединяйся</SubContentRed> с ними
                <ContentIcon src={uniteIcon}></ContentIcon>
              </SubContent>

              <SubContent>
                {' '}
                <SubContentRed>Выводи</SubContentRed> свой скилл на новый уровень!
                <ContentIcon src={improveIcon}></ContentIcon>
              </SubContent>
            </div>
            <StartButton onClick={openRegModal}>Начать сейчас</StartButton>
          </Content>
        </ContentContainer>
      </Main>
    </>
  );
};

const Main = styled.main`
  height: 80vh;
  background-image: url('${startPageBg}');
  background-size: 110%;
  background-repeat: no-repeat;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;

  flex-direction: column;
  color: var(--main-text-color);
  padding: 30px;
`;
const Content = styled.div`
  margin-top: 50px;
  width: 50%;
  text-align: center;
`;

const ContentTitle = styled.h1`
  text-transform: uppercase;
`;

const SubContent = styled.p`
  margin-top: 20px;
  font-size: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
`;
const SubContentRed = styled.span`
  color: #de8202;
  font-size: 30px;
  text-transform: uppercase;
  font-weight: 700;
`;
const ContentIcon = styled.img`
  width: 50px;
  margin-left: 20px;
  filter: invert(1);
`;

const StartButton = styled.button`
  margin-top: 50px;
  font-weight: 700;
  font-size: 20px;
  font-family: montserrat;
  text-transform: uppercase;
  color: #fff;
  padding: 5px 16px;
  border-radius: 4px;
  background: radial-gradient(circle at 10% 200%, rgb(217, 127, 8) 30%, rgb(0, 0, 0) 200%);

  background-size: 100%;
  height: 80px;

  width: 270px;
  border: 1px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    background-size: 150%;
  }
`;

export default StartPage;
