import React, { FC } from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  return <MainContainer>{children}</MainContainer>;
};

const MainContainer = styled.div`
  width: 100%;

  max-width: 1440px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 40px;
`;

export default Container;
