import React, { FC } from 'react';
import styled from 'styled-components';
import CommonButton from './CommonButton';
import Cs2Role from '../../types/Cs2Role';
import rolesIcons from '../../consts/rolesIcons';
interface RoleLableProps {
  role: Cs2Role;
}

const RoleLable: FC<RoleLableProps> = ({ role }) => {
  return (
    <RoleLableContainer>
      <img src={rolesIcons.get(role.id)} alt='' />
      <span>{role.name}</span>
    </RoleLableContainer>
  );
};

const RoleLableContainer = styled(CommonButton)`
  width: 140px;
  &:hover {
    background-color: #181818;
    border-color: #565656;
  }
  span {
    color: #d1cfcf;
  }
`;
export default RoleLable;
