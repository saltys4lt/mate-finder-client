import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { FC } from 'react';
interface ConfirmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  props?: any;
  children: React.ReactNode;
}

const CommonButton: FC<ConfirmButtonProps> = ({ children, ...props }) => {
  return (
    <div>
      <CommonButtonStyled {...props}>{children}</CommonButtonStyled>
    </div>
  );
};

const CommonButtonStyled = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;
  text-align: center;
  font-size: 16px;
  color: #d1cfcf;
  &:hover {
    border-color: #8f8f8f;
    cursor: pointer;
  }
  img {
    display: block;
    width: 20px;
    filter: invert(0.5);
  }
  &:disabled {
    opacity: 0.7;
    &:hover {
      border-color: #565656;
      cursor: auto;
    }
  }
`;

export default CommonButton;
