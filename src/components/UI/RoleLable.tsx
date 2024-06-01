import { FC } from 'react';
import styled from 'styled-components';
import CommonButton from './CommonButton';
import Cs2Role from '../../types/Cs2Role';
import rolesIcons from '../../consts/rolesIcons';
interface RoleLableProps {
  role: Cs2Role;
  className?: string;
  htmlFor?: string;
}

const RoleLable: FC<RoleLableProps> = ({ role, className, htmlFor }) => {
  return (
    <RoleLableContainer className={className} htmlFor={htmlFor}>
      <img src={rolesIcons.get(role.id)} alt='' />
      <span>{role.name}</span>
    </RoleLableContainer>
  );
};

const RoleLableContainer = styled.label`
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
    height: 20px;
    object-fit: cover;
    filter: invert(0.5);
  }
  &:disabled {
    opacity: 0.7;
    &:hover {
      border-color: #565656;
      cursor: auto;
    }
  }
  width: 140px;
  &:hover {
    background-color: #181818;
    border-color: #565656;
  }
  span {
    color: #d1cfcf;
    font-weight: 400;
  }
  &.active {
    border-color: #fff;
    transform: scale(1.03);
  }
`;
export default RoleLable;
