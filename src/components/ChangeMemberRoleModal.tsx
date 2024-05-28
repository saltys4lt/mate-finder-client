import { useState, FC, useEffect, ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import Team from '../types/Team';
import styled from 'styled-components';
import closeCross from '../assets/images/close-cross.png';
import { changeMemberRoleModal } from '../redux/modalSlice';
import Cs2Role from '../types/Cs2Role';
import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';
import ConfirmButton from './UI/ConfirmButton';
import Swal from 'sweetalert2';
import { Membership } from '../types/Membership';
import isDefaultAvatar from '../util/isDefaultAvatar';
import rolesIcons from '../consts/rolesIcons';
import ReactDOMServer from 'react-dom/server';
import switchIcon from '../assets/images/exchange.png';
import changeIcon from '../assets/images/new-role-arrow.png';

import updateTeam from '../redux/teamThunks/updateTeam';
import { resetStatus } from '../redux/userSlice';

interface ModalStatus {
  $active: string;
}

interface ChangeMemberRoleModalProps {
  member: Membership | null;
  members: Membership[];
  neededRoles: Cs2Role[];
  team: Team;
}

const ChangeMemberRoleModal: FC<ChangeMemberRoleModalProps> = ({ member, members, neededRoles, team }) => {
  const changeMemberRoleState = useSelector((state: RootState) => state.modalReducer.changeMemberRoleState);
  const updateTeamStatus = useSelector((state: RootState) => state.userReducer.updateTeamStatus);

  const [selectedRole, setSelectedRole] = useState<Cs2Role | null>(null);
  const [otherRoles, setOtherRoles] = useState<Cs2Role[]>([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setOtherRoles(neededRoles.filter((role) => role.id !== member?.roleId));
  }, [member]);

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

  const handleConfirmChange = () => {
    const sameRoleMember = members.find((member) => member.role.id === selectedRole?.id);
    if (sameRoleMember) {
      const selectedMember = member?.user;
      const switchCandidate = sameRoleMember?.user;

      const SwitchMembersRoles = () => {
        return (
          <SwitchMembersRolesContainer>
            <MembersContainer>
              <MemberCard>
                <img src={selectedMember?.user_avatar} alt='' />
                <span>{selectedMember?.nickname}</span>
                <RoleLabel>
                  <img src={rolesIcons.get(member?.role.id as number)} alt='' />
                  {member?.role.name as string}
                </RoleLabel>
              </MemberCard>
              <SwitchRoleImg src={switchIcon} />
              <MemberCard>
                <img src={switchCandidate?.user_avatar} alt='' />
                <span>{switchCandidate?.nickname}</span>
                <RoleLabel>
                  <img src={rolesIcons.get(sameRoleMember?.role.id as number)} alt='' />
                  {sameRoleMember?.role.name as string}
                </RoleLabel>
              </MemberCard>
            </MembersContainer>
            <p>Роли будут заменены между собой</p>
          </SwitchMembersRolesContainer>
        );
      };

      Swal.fire({
        title: 'Уверены?',
        html: ReactDOMServer.renderToString(<SwitchMembersRoles />),
        confirmButtonText: 'Подтвердить',
        showCancelButton: true,
        cancelButtonText: 'Отмена',
      }).then((res) => {
        if (res.isConfirmed) {
          const newMembership = team.members
            .map((membership) =>
              membership.id === member?.id ? { ...membership, roleId: sameRoleMember.roleId, role: sameRoleMember.role } : membership,
            )
            .map((membership) =>
              membership.id === sameRoleMember?.id
                ? { ...membership, roleId: member?.roleId as number, role: member?.role as Cs2Role }
                : membership,
            );
          dispatch(updateTeam({ ...team, members: newMembership }));
        }
      });
    } else {
      const selectedMember = member?.user;

      const SelectedMember = () => {
        return (
          <SwitchMembersRolesContainer>
            <MembersContainer>
              <MemberCard>
                <img src={selectedMember?.user_avatar} alt='' />
                <span>{selectedMember?.nickname}</span>
                <RoleLabel>
                  <img src={rolesIcons.get(member?.role.id as number)} alt='' />
                  {member?.role.name as string}
                </RoleLabel>
              </MemberCard>
              <SwitchRoleImg src={changeIcon} />
              <MemberCard>
                <img src={selectedMember?.user_avatar} alt='' />
                <span>{selectedMember?.nickname}</span>
                <RoleLabel>
                  <img src={rolesIcons.get(selectedRole?.id as number)} alt='' />
                  {selectedRole?.name as string}
                </RoleLabel>
              </MemberCard>
            </MembersContainer>

            <p>
              Роль будет изменена на <strong>{selectedRole?.name as string}</strong>
            </p>
          </SwitchMembersRolesContainer>
        );
      };
      Swal.fire({
        html: ReactDOMServer.renderToString(<SelectedMember />),
        confirmButtonText: 'Подтвердить',
        showCancelButton: true,
        cancelButtonText: 'Отмена',
      }).then((res) => {
        if (res.isConfirmed) {
          const newMembership = team.members.map((membership) =>
            membership.id === member?.id
              ? { ...membership, roleId: selectedRole?.id as number, role: selectedRole as Cs2Role }
              : membership,
          );
          const newNeededRoles = [...team.neededRoles.filter((role) => role.id !== (selectedRole?.id as number)), member?.role as Cs2Role];
          dispatch(updateTeam({ ...team, members: newMembership, neededRoles: newNeededRoles }));
        }
      });
    }
  };

  useEffect(() => {
    if (updateTeamStatus === 'fulfilled') {
      Swal.fire({
        icon: 'success',
        text: 'Роли успешно обновлены',
        timer: 2500,
        confirmButtonText: 'Понятно',
      });
      dispatch(resetStatus('updateTeamStatus'));
      setSelectedRole(null);
      dispatch(changeMemberRoleModal(false));
    }
  }, [updateTeamStatus]);

  return (
    <ModalContainer $active={String(changeMemberRoleState)}>
      <Content>
        <InnerContent>
          <CloseCross
            src={closeCross}
            onMouseUp={() => {
              dispatch(changeMemberRoleModal(false));
              setSelectedRole(null);
            }}
          />
          {member && (
            <>
              {otherRoles.length === 0 ? (
                <SelectedFriendContainer>
                  <SelectedTeamTitle>
                    <span>Все роли заняты 😥</span>
                    <p>Вы можете отменить приглашения или изменить нужные роли в редакторе команды</p>
                  </SelectedTeamTitle>
                </SelectedFriendContainer>
              ) : (
                <SelectedFriendContainer>
                  <SelectedTeamTitle>
                    <span>Выберите роль для</span>
                    <div>
                      <img src={isDefaultAvatar(member.user.user_avatar)} alt='' />
                      <span>{member.user.nickname}</span>
                    </div>
                  </SelectedTeamTitle>
                  <RolesContainer>
                    {otherRoles.map((role, index) => (
                      <RoleCard key={role.id}>
                        <RoleCheckbox
                          id={(index + 100).toString()}
                          onChange={(e) => {
                            handleSelectRole(e);
                          }}
                          value={role.name}
                          type='checkbox'
                        />
                        <RoleLabel className={selectedRoleState(role.name)} htmlFor={(index + 100).toString()}>
                          <img src={rolesIcons.get(role.id)} alt='' />
                          {role.name}
                        </RoleLabel>
                      </RoleCard>
                    ))}
                  </RolesContainer>
                  <StepButtons>
                    <StepButton
                      onClick={() => {
                        setSelectedRole(null);
                      }}
                    >
                      Отмена
                    </StepButton>
                    <StepButton
                      $isDisabled={!selectedRole}
                      disabled={!selectedRole}
                      onClick={() => {
                        handleConfirmChange();
                      }}
                    >
                      Подтвердить
                    </StepButton>
                  </StepButtons>
                </SelectedFriendContainer>
              )}
            </>
          )}
        </InnerContent>
      </Content>
    </ModalContainer>
  );
};

export default ChangeMemberRoleModal;

const ModalContainer = styled.div<ModalStatus>`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${(p) => (p.$active == 'false' ? 0 : 1)};
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: ${(p) => (p.$active == 'false' ? 'none' : 'all')};
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

const SelectedFriendContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 300px;
`;
const SelectedTeamTitle = styled.h3`
  > span {
    text-align: center;
    color: var(--main-text-color);
  }
  > div {
    border-radius: 5px;
    border: 2px solid #6e6e6e;
    padding: 5px;
    background-color: #181818;
    margin-top: 20px;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    column-gap: 10px;
    > span {
      color: var(--main-text-color);
      font-size: 18px;
      font-weight: 400;
    }
    > img {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  > p {
    text-align: center;
    color: var(--main-text-color);
    margin-top: 10px;
    font-size: 14px;
  }
`;
const StepButtons = styled.div`
  display: flex;
  align-items: center;
  column-gap: 30px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 130px;
  text-align: center;
  font-size: 16px;
  color: #d1cfcf;
  column-gap: 10px;
  img {
    display: block;
    width: 20px;
    height: 20px;
    object-fit: cover;
    filter: invert(0.5);
  }

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

const StepButton = styled(ConfirmButton)<{ $isDisabled: boolean }>`
  font-size: 16px;
  opacity: ${(p) => (p.$isDisabled ? '0.3' : '1')};
  cursor: ${(p) => (p.$isDisabled ? 'auto' : 'pointer')};
  &:hover {
    background-color: ${(p) => p.$isDisabled && '#000'};
  }
`;

const SwitchMembersRolesContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  justify-content: center;
  p {
    font-weight: 700;
    font-size: 19px;
  }
`;

const MembersContainer = styled.div`
  display: flex;
  align-items: center;

  justify-content: space-between;
`;

const MemberCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #333;
  border-radius: 10px;
  padding: 10px 10px;
  row-gap: 10px;
  align-items: center;
  > img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
  }
  > span {
    color: var(--main-text-color);
    font-weight: 700;
  }
`;

const SwitchRoleImg = styled.img`
  align-self: flex-end;
  width: 100%;
  height: 100%;
  max-width: 100px;
`;
