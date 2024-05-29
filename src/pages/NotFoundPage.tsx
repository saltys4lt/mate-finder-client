import styled from 'styled-components';

const NotFoundPage = () => {
  console.log('dsdsdsdsdsd');
  return (
    <Main>
      <h1 style={{ fontSize: '80px' }}>404</h1>
      <h1>Что-то пошло не так...</h1>
      <h2>Страница не найдена</h2>
    </Main>
  );
};

const Main = styled.main`
  color: var(--main-text-color);
  flex: 1;
  display: flex;
  height: 80vh;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

export default NotFoundPage;
