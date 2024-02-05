import styled from 'styled-components';
import Modal from '../components/Modal';
import { useAppDispatch } from '../redux';
import { changeRegState } from '../redux/modalSlice';

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
            <ContentTitle>your new gameplay begins here</ContentTitle>
            <div style={{ marginTop: '80px' }}>
              <SubContent>
                <SubContentRed>Discover</SubContentRed> your gaming companions
                <ContentIcon src='/images/mates.png'></ContentIcon>
              </SubContent>
              <SubContent>
                <SubContentRed>Unite</SubContentRed> with a team
                <ContentIcon src='/images/unite.png'></ContentIcon>
              </SubContent>

              <SubContent>
                {' '}
                <SubContentRed>Improve</SubContentRed> your game skills!
                <ContentIcon src='/images/improve.png'></ContentIcon>
              </SubContent>
            </div>
            <StartButton onClick={openRegModal}>Let's start</StartButton>
          </Content>
        </ContentContainer>
      </Main>
    </>
  );
};

const Main = styled.main`
  height: 80vh;
  background-image: url('/images/start-page-bg.jpg');
  background-size: 100%;
  background-repeat: no-repeat;
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;

  align-items: flex-end;
  flex-direction: column;
  color: #fff;
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
  color: #f33e3e;
  font-size: 30px;
  text-transform: uppercase;
`;
const ContentIcon = styled.img`
  filter: invert(1);
  width: 50px;
  margin-left: 20px;
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
  background: radial-gradient(circle at 10% 200%, rgb(197, 84, 76) 30%, rgb(0, 0, 0) 200%);

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
