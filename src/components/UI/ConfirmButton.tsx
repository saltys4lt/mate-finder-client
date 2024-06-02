import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { FC } from 'react';
interface ConfirmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  props?: any;
  children: React.ReactNode;
}

const ConfirmButton: FC<ConfirmButtonProps> = ({ children, ...props }) => {
  return <ConfirmButtonStyled {...props}>{children}</ConfirmButtonStyled>;
};

const ConfirmButtonStyled = styled.button`
  display: inline;
  color: #c4c4c4;
  border: 0;
  padding: 7px 12px;
  background-color: #000000;
  cursor: pointer;
  font-size: 20px;
  text-transform: uppercase;
  font-family: 'montserrat';
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.03);
    background-color: var(--orange-color);
    color: #fff;
  }
`;

export default ConfirmButton;
