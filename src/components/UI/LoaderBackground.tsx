import { FC } from 'react';
import styled from 'styled-components';

interface LoaderBackgroundProps {
  bgColor?: string;
  borderRadius?: string;
}

const LoaderBackground: FC<LoaderBackgroundProps> = ({ bgColor = '#bababa', borderRadius = '20px' }) => {
  return <Component bgColor={bgColor} borderRadius={borderRadius} />;
};

const Component = styled.div<LoaderBackgroundProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.bgColor};
  opacity: 0.7;
  inset: 0;
  margin: auto;
  border-radius: ${(p) => p.borderRadius};
  z-index: 2;
`;

export default LoaderBackground;
