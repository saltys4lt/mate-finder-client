import Container from '../components/Container';
import styled from 'styled-components';

const PlayersPage = () => {
  return (
    <Main>
      <Container>
        <MainContainer>
          <LeftContainer>
            <SearchBar></SearchBar>
            <ListContainer></ListContainer>
          </LeftContainer>
          <RightContainer>
            <FilterBar></FilterBar>
          </RightContainer>
        </MainContainer>
      </Container>
    </Main>
  );
};

const Main = styled.main`
  padding-block: 20px;
`;

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  height: 80vh;
`;

const LeftContainer = styled.div`
  width: 70%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;
const RightContainer = styled.div`
  width: 28%;
  flex-direction: column;
  height: 100%;
`;

const SearchBar = styled.div``;
const ListContainer = styled.div``;

const FilterBar = styled.div``;

export default PlayersPage;
