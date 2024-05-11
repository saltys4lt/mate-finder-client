import React, { useState, FC, useEffect, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import Team from '../types/Team';
import styled from 'styled-components';
import closeCross from '../assets/images/close-cross.png';
import { changeRequestToTeamModalState } from '../redux/modalSlice';
import Player from '../types/Player';
import Cs2Role from '../types/Cs2Role';
import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';
import ConfirmButton from './UI/ConfirmButton';
import { TeamRequest } from '../types/TeamRequest';
import { sendTeamRequest } from '../api/teamRequsts.ts/sendTeamRequest';

import Swal from 'sweetalert2';
import { ioSocket } from '../api/webSockets/socket';
interface ModalStatus {
  $active: boolean;
}

interface SendRequestToTeamProps {
  team: Team;
}

const RequestToTeamModal: FC<SendRequestToTeamProps> = ({ team }) => {
  const requestToTeamModalIsActive = useSelector((state: RootState) => state.modalReducer.requestToTeamModalIsActive);
  const id = useSelector((state: RootState) => state.userReducer.user?.id);

  const [selectedRole, setSelectedRole] = useState<Cs2Role | null>(null);
  const [otherRoles, setOtherRoles] = useState<Cs2Role[]>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (team) {
      setOtherRoles(
        Cs2PlayerRoles.filter((role) => role.name !== team.ownerRole && !team.members.find((member) => member.roleId === role.id)),
      );
    }
  }, [team]);

  const handleSelectRole = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === selectedRole?.name) {
      setSelectedRole(null);
      return;
    }

    setSelectedRole(Cs2PlayerRoles.find((role) => role.name === e.target.value) as Cs2Role);
  };

  const selectedRoleState = (role: string) => {
    return selectedRole?.name === role ? 'active' : '';
  };

  const handleSendTeamRequest = () => {
    const teamRequest: TeamRequest = { isFromTeam: false, roleId: selectedRole?.id as number, teamId: team.id, toUserId: id as number };
    sendTeamRequest(teamRequest);
    setSelectedRole(null);
    dispatch(changeRequestToTeamModalState(false));
    Swal.fire({ icon: 'success', titleText: 'Заявка отправлена!', timer: 2000, confirmButtonText: 'Понятно' });
  };
  return (
    <ModalContainer $active={requestToTeamModalIsActive}>
      <Content>
        <InnerContent>
          <CloseCross
            src={closeCross}
            onClick={() => {
              dispatch(changeRequestToTeamModalState(false));
            }}
          />
          <RequestModalTitle>Выберите роль</RequestModalTitle>
          <RolesContainer>
            {otherRoles.map((role, index) => (
              <RoleCard key={role.id}>
                <RoleCheckbox
                  id={(index + 50).toString()}
                  onChange={(e) => {
                    handleSelectRole(e);
                  }}
                  value={role.name}
                  type='checkbox'
                />
                <RoleLabel className={selectedRoleState(role.name)} htmlFor={(index + 50).toString()}>
                  {role.name}
                </RoleLabel>
              </RoleCard>
            ))}
          </RolesContainer>
          <StyledConfirmButton $isDisabled={!selectedRole} disabled={!selectedRole} onClick={handleSendTeamRequest}>
            Отправить
          </StyledConfirmButton>
        </InnerContent>
      </Content>
    </ModalContainer>
  );
};

export default RequestToTeamModal;

const ModalContainer = styled.div<ModalStatus>`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${(p) => (!p.$active ? 0 : 1)};
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: ${(p) => (!p.$active ? 'none' : 'all')};
  transition: opacity 0.2s ease-in-out;
  z-index: 2;
`;

const Content = styled.div`
  position: relative;
  display: flex;

  padding: 20px;
  border-radius: 12px;
  background-color: #393939;
  width: 430px;
  min-height: 200px;

  max-height: 600px;
  transition: all 0.2s ease-in-out;
`;
const InnerContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
`;
const CloseCross = styled.img`
  padding-right: 10px;
  padding-top: 10px;
  display: block;
  width: 25px;
  height: 25px;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  filter: invert(0.8);
  &:hover {
    transform: scale(1.1);
  }
`;
const RequestModalTitle = styled.h3`
  color: var(--main-text-color);
  font-size: 18px;
`;

const RolesContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;

  column-gap: 10px;
  flex-wrap: wrap;
`;

const RoleCard = styled.div`
  margin-top: 15px;

  display: flex;
  justify-content: center;
`;

const RoleCheckbox = styled.input`
  display: none;
`;

const RoleLabel = styled.label`
  border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;
  display: block;
  width: 130px;
  text-align: center;
  font-size: 16px;
  color: #d1cfcf;
  &:hover {
    border-color: #fff;
    cursor: pointer;
  }

  &.active {
    border-color: #fff;
    transform: scale(1.03);
  }

  &.focus {
    opacity: 0.3;
    border: 2px solid #565656;
    &:hover {
      cursor: auto;
    }
  }

  user-select: none;
  &:hover {
    cursor: pointer;
  }
`;

const StyledConfirmButton = styled(ConfirmButton)<{ $isDisabled: boolean }>`
  font-size: 16px;
  opacity: ${(p) => (p.$isDisabled ? '0.3' : '1')};
  cursor: ${(p) => (p.$isDisabled ? 'auto' : 'pointer')};
  &:hover {
    background-color: ${(p) => p.$isDisabled && '#000'};
  }
`;
