import { FC } from 'react';
import styled from 'styled-components';

interface LoaderBackgroundProps {
  BgColor?: string;
  BorderRadius?: string;
}

const LoaderBackground: FC<LoaderBackgroundProps> = ({ BgColor = '#bababa', BorderRadius = '20px' }) => {
  return <Component BgColor={BgColor} BorderRadius={BorderRadius} />;
};

const Component = styled.div<LoaderBackgroundProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.BgColor};
  opacity: 0.7;
  inset: 0;
  margin: auto;
  border-radius: ${(p) => p.BorderRadius};
  z-index: 2;
`;

export default LoaderBackground;
