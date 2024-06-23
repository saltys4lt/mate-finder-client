import React from 'react';
import styled, { keyframes, CSSProperties } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonWrapper = styled.div<{ width?: string; height?: string }>`
  display: inline-block;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '100%'};
  background: #333333;
  background-image: linear-gradient(to right, #333333 0%, #7c7c7c 20%, #333333 40%, #333333 100%); /* Переливание светло-серым */
  background-repeat: no-repeat;
  background-size: 1000px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  style?: CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, style }) => <SkeletonWrapper width={width} height={height} style={style} />;

export default Skeleton;
