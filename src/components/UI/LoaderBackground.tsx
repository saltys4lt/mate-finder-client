import { FC } from 'react';
import styled from 'styled-components';

interface LoaderBackgroundProps {
  bgcolor?: string;
  borderradius?: string;
}

const LoaderBackground: FC<LoaderBackgroundProps> = ({ bgcolor = '#bababa', borderradius = '20px' }) => {
  return <Component bgcolor={bgcolor} borderradius={borderradius} />;
};

const Component = styled.div<LoaderBackgroundProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.bgcolor};
  opacity: 0.7;
  inset: 0;
  margin: auto;
  border-radius: ${(p) => p.borderradius};
  z-index: 2;
`;

export default LoaderBackground;
