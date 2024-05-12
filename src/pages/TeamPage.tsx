import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import Team from '../types/Team';
import { fetchTeam } from '../api/teamRequsts.ts/fetchTeam';
import headerBg from '../assets/images/cs-creation-bg.webp';
import CommonButton from '../components/UI/CommonButton';
import Container from '../components/Container';
import linkIcon from '../assets/images/link.png';
import groupInviteIcon from '../assets/images/group-invite.png';
import rolesIcons from '../consts/rolesIcons';
import isDefaultAvatar from '../util/isDefaultAvatar';
import Cs2Role from '../types/Cs2Role';
import copyCurrentUrl from '../util/copyCurrentUrl';
import ClientUser from '../types/ClientUser';
import FriendsInviteModal from '../components/FriendsInviteModal';
import { FriendWithRole } from '../types/FriendWithRole';
import { changeFriendsInviteModalState, changeRequestToTeamModalState } from '../redux/modalSlice';
import cancelIcom from '../assets/images/cancel-invite.png';
import { TeamRequest } from '../types/TeamRequest';
import Swal from 'sweetalert2';
import { cancelRequest } from '../api/teamRequsts.ts/cancelRequest';
import ReactDOMServer from 'react-dom/server';
import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';
import chatIcon from '../assets/images/chat.png';
import { setCurrentChat } from '../redux/chatSlice';
import { Chat } from '../types/Chat';
import { changeChatState } from '../redux/modalSlice';
import { ioSocket } from '../api/webSockets/socket';
import sendedRequestIcon from '../assets/images/sended-friend-req.png';
import RequestToTeamModal from '../components/RequestToTeamModal';
import { useTeamRequests } from '../hooks/useTeamRequests';
import confirmIcon from '../assets/images/confirm-edit.png';
import { answerTeamRequest } from '../api/teamRequsts.ts/answerTeamRequest';
import { leaveFromTeam } from '../api/teamRequsts.ts/leaveFromTeam';
const TeamPage = () => {
  const user = useSelector((state: RootState) => state.userReducer.user) as ClientUser;

  const [section, setSection] = useState<number>(-1);
  const [urlTextCopied, setUrlTextCopied] = useState<boolean>(false);
  const [invitedFriends, setInvitedFriends] = useState<FriendWithRole[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const name = useParams().name;
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamRequestsFromPlayers, teamRequestsFromTeam] = useTeamRequests(currentTeam?.teamRequests, user.id);

  useEffect(() => {
    (async () => {
      const team = await fetchTeam(name as string);
      if (typeof team !== 'string') {
        setCurrentTeam(team as Team);
      }
    })();
  }, [user.teams]);

  useEffect(() => {
    if (currentTeam) {
      setRoles(
        Cs2PlayerRoles.filter((role) => (currentTeam.members.find((member) => member.roleId === role.id) ? true : false)).map(
          (role) => role.name,
        ),
      );

      setInvitedFriends([
        ...currentTeam.teamRequests
          .filter((req) => user.friends.find((friend) => friend.id === req.toUserId))
          .map((req) => ({
            id: req.toUserId as number,
            nickname: req.user?.nickname as string,
            user_avatar: req.user?.user_avatar as string,
            role: req.role?.name as string,
          })),
        ...currentTeam.members
          .filter((member) => user.friends.find((friend) => friend.id === member.user.id))
          .map((member) => ({
            id: member.user.id as number,
            nickname: member.user?.nickname as string,
            user_avatar: member.user?.user_avatar as string,
            role: member.role?.name as string,
          })),
      ]);
    }
  }, [currentTeam]);

  const ownerRole: Cs2Role = Cs2PlayerRoles.find((role) => role.name === currentTeam?.ownerRole) as Cs2Role;

  const handleCancelTeamRequest = (req: TeamRequest) => {
    const InvitedFriendRender = () => {
      return (
        <div>
          <p>Отменить приглашение для</p>
          <InvitedFriendItem>
            <img src={isDefaultAvatar(req.user?.user_avatar as string)} alt='' />
            <span>{req.user?.nickname}</span>
          </InvitedFriendItem>
        </div>
      );
    };
    Swal.fire({
      html: ReactDOMServer.renderToString(<InvitedFriendRender />),
      cancelButtonText: 'Отмена',
      showCancelButton: true,
      confirmButtonText: 'Подтвердить',
      confirmButtonColor: 'red',
    }).then((res) => {
      if (res.isConfirmed) cancelRequest(req);
      else return;
    });
  };

  const handleOpenChat = () => {
    dispatch(changeChatState(true));
    dispatch(setCurrentChat(currentTeam?.chat as Chat));
    const teamChat = currentTeam?.chat as Chat;
    if (teamChat) {
      if (teamChat.messages.find((message) => message.checked.find((checkedBy) => checkedBy.userId === user.id && !checkedBy.isChecked))) {
        const checkedMessages = teamChat.messages.filter((message) =>
          message.checked.find((checkedBy) => checkedBy.userId === user.id && !checkedBy.isChecked) ? true : false,
        );
        const userIds: number[] = teamChat.members
          .filter((member) => checkedMessages.find((message) => message.userId === member.id))
          .map((member) => member.id);
        ioSocket.emit('checkWholeChat', { messages: checkedMessages, userId: user.id, userIds: userIds });
      }
      dispatch(setCurrentChat(teamChat));
    }
  };

  const handleOpenRequestToTeamModal = () => {
    dispatch(changeRequestToTeamModalState(true));
  };

  const handleLeaveFromTeam = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Уверены ?',
      text: 'Возможно это расстроит ваших товарищей по команде 😢',
      confirmButtonText: 'Покинуть команду',
      showCancelButton: true,
      cancelButtonText: 'Отмена',
    }).then((res) => {
      if (res.isConfirmed) {
        leaveFromTeam({ team: currentTeam as Team, userId: user.id, byOwner: false });
      }
    });
  };

  return currentTeam === null ? (
    <Loader />
  ) : (
    <Main>
      <FriendsInviteModal
        roles={roles}
        setRoles={setRoles}
        invitedFriends={invitedFriends}
        setInvitedFriends={setInvitedFriends}
        ownerRole={currentTeam.ownerRole}
        teamId={currentTeam.id}
      />
      <RequestToTeamModal team={currentTeam} />
      <TeamHeader>
        <HeaderBg />
        <Container>
          <TeamHeaderData>
            <img src={currentTeam?.avatar} alt='' />
            <TeamHeaderLeftData>
              {' '}
              <h4>{currentTeam?.name}</h4>
              <span>
                Создатель <span>{currentTeam?.user.nickname}</span>
              </span>
            </TeamHeaderLeftData>
            {(currentTeam.userId === user.id || currentTeam.members.find((member) => member.user.id === user.id)) && (
              <div style={{ marginTop: 'auto' }}>
                {' '}
                <CommonButton
                  onClick={() => {
                    handleOpenChat();
                  }}
                >
                  <img src={chatIcon} alt='' />
                </CommonButton>
              </div>
            )}

            <TeamHeaderButtons style={{ position: 'relative' }}>
              <CommonButton
                onClick={() => {
                  copyCurrentUrl();
                  setUrlTextCopied(true);
                  setTimeout(() => {
                    setUrlTextCopied(false);
                  }, 2000);
                }}
              >
                <img src={linkIcon} alt='' />
                Скопировать ссылку
              </CommonButton>{' '}
              {urlTextCopied && <CopyUrlText>Ссылка скопирована!</CopyUrlText>}
              {user.id === currentTeam.userId ? (
                <CommonButton
                  onClick={() => {
                    dispatch(changeFriendsInviteModalState(true));
                  }}
                >
                  {' '}
                  <img src={groupInviteIcon} alt='' />
                  Пригласить друзей
                </CommonButton>
              ) : user.memberOf.find((memberOf) => memberOf.teamId === currentTeam.id) ? (
                <CommonButton onClick={handleLeaveFromTeam}>
                  {' '}
                  <img src={cancelIcom} alt='' />
                  Покинуть команду
                </CommonButton>
              ) : user.requestsToTeam.find((req) => req.teamId === currentTeam.id && req.isFromTeam) ? (
                <CommonButton>
                  {' '}
                  <img src={sendedRequestIcon} alt='' />
                  Ждет вашего ответа
                </CommonButton>
              ) : user.requestsToTeam.find((req) => req.teamId === currentTeam.id && !req.isFromTeam) ? (
                <CommonButton
                  onClick={() => {
                    const req = user.requestsToTeam.find((req) => req.teamId === currentTeam.id && !req.isFromTeam) as TeamRequest;
                    cancelRequest(req);
                  }}
                >
                  {' '}
                  <img src={cancelIcom} alt='' />
                  Отменить заявку
                </CommonButton>
              ) : (
                currentTeam.public && (
                  <CommonButton onClick={handleOpenRequestToTeamModal}>
                    {' '}
                    <img src={groupInviteIcon} alt='' />
                    Отправить запрос
                  </CommonButton>
                )
              )}
            </TeamHeaderButtons>
          </TeamHeaderData>
        </Container>
      </TeamHeader>
      <Container>
        {currentTeam.neededRoles.length > 0 && (
          <NeededPlayersRow>
            <p>Нужные игроки:</p>
            <NeededPlayersList>
              {currentTeam.neededRoles.map((role) => (
                <RoleLable key={role.id}>
                  <img src={rolesIcons.get(role.id)} alt='' />
                  {role.name}
                </RoleLable>
              ))}
            </NeededPlayersList>
          </NeededPlayersRow>
        )}

        <MembersSectionTitle>
          <div>
            <SectionType
              onClick={() => {
                if (section !== -1) setSection(-1);
              }}
              $selected={section === -1}
            >
              Участники ({currentTeam.members.length + 1})
            </SectionType>
            {currentTeam.userId === user.id && teamRequestsFromTeam.length !== 0 && (
              <SectionType
                onClick={() => {
                  if (section !== 0) setSection(0);
                }}
                $selected={section === 0}
              >
                Приглашенные ({teamRequestsFromTeam.length})
              </SectionType>
            )}

            {currentTeam.userId === user.id && teamRequestsFromPlayers.length !== 0 && (
              <SectionType
                onClick={() => {
                  if (section !== 1) setSection(1);
                }}
                $selected={section === 1}
              >
                Заявки на вступление ({teamRequestsFromPlayers.length})
              </SectionType>
            )}
          </div>
          {section === -1 && (
            <span>
              ELO в среднем: &nbsp;
              <span>
                {Math.floor(
                  ((currentTeam.user.cs2_data?.elo as number) +
                    currentTeam.members.reduce((start, member) => (member.user.cs2_data?.elo as number) + start, 0)) /
                    (currentTeam.members.length + 1),
                )}
              </span>
            </span>
          )}
        </MembersSectionTitle>
        <MembersAndDescription>
          <MembersSection>
            <MembersList>
              {section === -1 && (
                <>
                  {' '}
                  <MemberItem>
                    <MemberItemHeader>
                      <MemberAvatar
                        onClick={() => {
                          navigate(`/profile/${currentTeam.user.nickname}`);
                        }}
                        src={isDefaultAvatar(currentTeam.user.user_avatar as string)}
                        alt=''
                      />
                      <div>
                        <div>
                          <MemberLvl src={currentTeam.user.cs2_data?.lvlImg} alt='' />
                          <span> {currentTeam.user.cs2_data?.elo} elo </span>
                        </div>

                        <MemberNickname
                          onClick={() => {
                            navigate(`/profile/${currentTeam.user.nickname}`);
                          }}
                        >
                          {currentTeam.user.nickname}
                        </MemberNickname>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <RoleLable>
                          <img src={rolesIcons.get(ownerRole.id)} alt='' />
                          {ownerRole.name}
                        </RoleLable>
                      </div>
                    </MemberItemHeader>
                    <MemberCsDataRow>
                      <MemberCsDataText>
                        КД: &nbsp;<span>{currentTeam.user?.cs2_data?.kd}</span>
                      </MemberCsDataText>
                      <MemberCsDataText>
                        Убийств в голову: &nbsp;<span>{currentTeam.user?.cs2_data?.hs} %</span>
                      </MemberCsDataText>
                      <MemberCsDataText>
                        Матчи: &nbsp;<span>{currentTeam.user?.cs2_data?.matches}</span>
                      </MemberCsDataText>

                      <MemberCsDataText>
                        Процент побед: &nbsp;<span>{currentTeam.user?.cs2_data?.winrate} %</span>
                      </MemberCsDataText>
                    </MemberCsDataRow>
                  </MemberItem>
                  {currentTeam.members.map((member) => (
                    <MemberItem key={member.id}>
                      <MemberItemHeader>
                        <MemberAvatar
                          onClick={() => {
                            navigate(`/profile/${member.user.nickname}`);
                          }}
                          src={isDefaultAvatar(member.user.user_avatar as string)}
                          alt=''
                        />
                        <div>
                          <div>
                            <MemberLvl src={member.user.cs2_data?.lvlImg} alt='' />
                            <span> {member.user.cs2_data?.elo} elo </span>
                          </div>

                          <MemberNickname
                            onClick={() => {
                              navigate(`/profile/${member.user.nickname}`);
                            }}
                          >
                            {member.user.nickname}
                          </MemberNickname>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <RoleLable>
                            <img src={rolesIcons.get(member.roleId)} alt='' />
                            {member.role.name}
                          </RoleLable>
                        </div>
                      </MemberItemHeader>
                      <MemberCsDataRow>
                        <MemberCsDataText>
                          КД: &nbsp;<span>{member.user?.cs2_data?.kd}</span>
                        </MemberCsDataText>
                        <MemberCsDataText>
                          Убийств в голову: &nbsp;<span>{member.user?.cs2_data?.hs} %</span>
                        </MemberCsDataText>
                        <MemberCsDataText>
                          Матчи: &nbsp;<span>{member.user?.cs2_data?.matches}</span>
                        </MemberCsDataText>

                        <MemberCsDataText>
                          Процент побед: &nbsp;<span>{member.user?.cs2_data?.winrate} %</span>
                        </MemberCsDataText>
                      </MemberCsDataRow>
                    </MemberItem>
                  ))}
                </>
              )}{' '}
              {section === 0 && (
                <>
                  {' '}
                  {teamRequestsFromTeam.map((req) => (
                    <InvitedPlayer key={req.user?.id}>
                      <MemberItemHeader>
                        <MemberAvatar
                          onClick={() => {
                            navigate(`/profile/${req.user?.nickname}`);
                          }}
                          src={isDefaultAvatar(req.user?.user_avatar as string)}
                          alt=''
                        />
                        <div>
                          <div>
                            <MemberLvl src={req.user?.cs2_data?.lvlImg} alt='' />
                            <span> {req.user?.cs2_data?.elo} elo </span>
                          </div>

                          <MemberNickname
                            onClick={() => {
                              navigate(`/profile/${req.user?.nickname}`);
                            }}
                          >
                            {req.user?.nickname}
                          </MemberNickname>
                        </div>
                        <div
                          style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', columnGap: '5px' }}
                        >
                          <span style={{ fontSize: 14, marginTop: 8 }}>Приглашение на роль:</span>
                          <RoleLable>
                            <img src={rolesIcons.get(req.roleId)} alt='' />
                            {req.role?.name}
                          </RoleLable>
                        </div>
                      </MemberItemHeader>
                      <MemberCsDataRow>
                        <MemberCsDataText>
                          КД: &nbsp;<span>{req.user?.cs2_data?.kd}</span>
                        </MemberCsDataText>
                        <MemberCsDataText>
                          Убийств в голову: &nbsp;<span>{req.user?.cs2_data?.hs} %</span>
                        </MemberCsDataText>
                        <MemberCsDataText>
                          Матчи: &nbsp;<span>{req.user?.cs2_data?.matches}</span>
                        </MemberCsDataText>

                        <MemberCsDataText>
                          Процент побед: &nbsp;<span>{req.user?.cs2_data?.winrate} %</span>
                        </MemberCsDataText>
                      </MemberCsDataRow>
                      <CancelInviteButton
                        onClick={() => {
                          handleCancelTeamRequest({ ...req, team: currentTeam });
                        }}
                      >
                        <img src={cancelIcom} alt='' /> Отменить приглашение
                      </CancelInviteButton>
                    </InvitedPlayer>
                  ))}
                </>
              )}
              {section === 1 && (
                <>
                  {' '}
                  {teamRequestsFromPlayers.map((req) => (
                    <InvitedPlayer key={req.user?.id}>
                      <MemberItemHeader>
                        <MemberAvatar
                          onClick={() => {
                            navigate(`/profile/${req.user?.nickname}`);
                          }}
                          src={isDefaultAvatar(req.user?.user_avatar as string)}
                          alt=''
                        />
                        <div>
                          <div>
                            <MemberLvl src={req.user?.cs2_data?.lvlImg} alt='' />
                            <span> {req.user?.cs2_data?.elo} elo </span>
                          </div>

                          <MemberNickname
                            onClick={() => {
                              navigate(`/profile/${req.user?.nickname}`);
                            }}
                          >
                            {req.user?.nickname}
                          </MemberNickname>
                        </div>
                        <div
                          style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', columnGap: '5px' }}
                        >
                          <span style={{ fontSize: 14, marginTop: 8 }}>Заявка на роль:</span>
                          <RoleLable>
                            <img src={rolesIcons.get(req.roleId)} alt='' />
                            {req.role?.name}
                          </RoleLable>
                        </div>
                      </MemberItemHeader>
                      <MemberCsDataRow>
                        <MemberCsDataText>
                          КД: &nbsp;<span>{req.user?.cs2_data?.kd}</span>
                        </MemberCsDataText>
                        <MemberCsDataText>
                          Убийств в голову: &nbsp;<span>{req.user?.cs2_data?.hs} %</span>
                        </MemberCsDataText>
                        <MemberCsDataText>
                          Матчи: &nbsp;<span>{req.user?.cs2_data?.matches}</span>
                        </MemberCsDataText>

                        <MemberCsDataText>
                          Процент побед: &nbsp;<span>{req.user?.cs2_data?.winrate} %</span>
                        </MemberCsDataText>
                      </MemberCsDataRow>

                      <ReqsButtons>
                        <CancelReqButton
                          onClick={() => {
                            answerTeamRequest({ accept: false, req });
                          }}
                        >
                          <img src={cancelIcom} alt='' /> Отклонить
                        </CancelReqButton>{' '}
                        <AcceptReqButton
                          onClick={() => {
                            answerTeamRequest({ accept: true, req });
                          }}
                        >
                          <img src={confirmIcon} alt='' /> Принять
                        </AcceptReqButton>
                      </ReqsButtons>
                    </InvitedPlayer>
                  ))}
                </>
              )}
            </MembersList>
          </MembersSection>
          <Description>
            <DescriptionTitle>Описание</DescriptionTitle>
            <DescriptionText>{currentTeam.description ? currentTeam.description : 'Информация отсутствует'}</DescriptionText>
          </Description>
        </MembersAndDescription>
      </Container>
    </Main>
  );
};

const Main = styled.main`
  flex: 1;
  color: var(--main-text-color);
  margin-bottom: 20px;
`;

const TeamHeader = styled.div`
  width: 100%;
  min-height: 250px;
  overflow: hidden;
`;
const HeaderBg = styled.div`
  width: 100%;
  height: 220px;
  background-color: rgb(22, 22, 22);
  background-image: linear-gradient(rgba(22, 22, 22, 0) 0%, rgb(22, 22, 22) 95%), url('${headerBg}');
  z-index: -1;
  background-position: 100% 30%;
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(2px);
`;

const TeamHeaderData = styled.div`
  position: relative;
  margin-top: -30px;
  display: flex;
  align-items: center;
  column-gap: 15px;
  width: 100%;
  z-index: 1;
  > img {
    width: 120px;
    height: 120px;
    border-radius: 15px;
    object-fit: cover;
    border: 2px solid #333;
  }
`;
const TeamHeaderLeftData = styled.div`
  display: flex;
  row-gap: 5px;
  flex-direction: column;
  margin-top: auto;
  color: var(--main-text-color);
  > h4 {
    font-size: 28px;
    font-weight: 700;
  }
  > span {
    font-size: 15px;
    font-weight: 400;
    > span {
      font-weight: 700;
      color: aliceblue;
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
  }
`;
const TeamHeaderButtons = styled.div`
  display: flex;
  position: relative;
  column-gap: 15px;
  margin-left: auto;
  margin-top: auto;
`;
const NeededPlayersRow = styled.section`
  margin-top: 30px;
  display: flex;
  align-items: center;
  column-gap: 20px;
  > p {
    color: var(--main-text-color);

    font-size: 16px;
  }
`;

const NeededPlayersList = styled.div`
  display: flex;

  column-gap: 15px;
`;
const RoleLable = styled(CommonButton)`
  width: 120px;
  &:hover {
    background-color: #181818;
    border-color: #565656;
  }
  span {
    font-weight: 700;
    color: #dbdbdb;
  }
`;

const MembersAndDescription = styled.section`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const MembersSection = styled.section`
  margin-top: 20px;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SectionType = styled.span<{ $selected: boolean }>`
  font-weight: ${(p) => (p.$selected ? 700 : 400)};
  color: ${(p) => (p.$selected ? 'var(--main-text-color)' : '#636363')};
  &:hover {
    cursor: pointer;
  }
`;

const MembersSectionTitle = styled.h4`
  width: 100%;
  border-bottom: 1px solid #919191;
  padding-bottom: 10px;
  margin-block: 20px;
  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
    column-gap: 20px;
  }

  > span {
    text-align: right;
    font-weight: 400;
    color: #ececec;
    > span {
      font-weight: 700;
    }
  }
`;

const MembersList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const MemberItem = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 590px;
  background-color: #202020;
  border-radius: 5px;
`;

const InvitedPlayer = styled(MemberItem)``;

const CancelInviteButton = styled(CommonButton)`
  margin-top: 15px;
`;

const ReqsButtons = styled.div`
  margin-top: 15px;
  margin-left: auto;
  display: flex;
  align-items: center;
  column-gap: 15px;
`;

const AcceptReqButton = styled(CommonButton)`
  border-color: green;
  width: 130px;
`;

const CancelReqButton = styled(CommonButton)`
  border-color: var(--main-red-color);
  width: 130px;
`;
const MemberItemHeader = styled.div`
  width: 100%;
  display: flex;

  column-gap: 15px;
  position: relative;
  > div {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
    > div {
      display: flex;
      align-items: center;
      column-gap: 10px;
      > span {
        font-size: 14px;
        color: #9f9f9f;
      }
    }
  }
`;

const MemberLvl = styled.img`
  width: 30px;
  height: 30px;
  object-fit: cover;
  margin-left: -10px;
`;
const MemberAvatar = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

const MemberNickname = styled.span`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
    color: #fff;
  }
`;

const MemberCsDataRow = styled.div`
  margin-top: 15px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  column-gap: 15px;
`;

const MemberCsDataText = styled.p`
  white-space: nowrap;
  font-size: 14px;
  color: #9f9f9f;
  display: flex;
  align-items: center;

  span {
    font-size: 16px;
    font-weight: 700;
    color: #e0e0e0;
  }
`;

const Description = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const DescriptionTitle = styled.h4`
  color: var(--main-text-color);
  font-size: 19px;
`;

const DescriptionText = styled.p`
  padding: 9px 15px;
  color: #fff;
  background-color: #2f2f2f;
  min-height: 220px;
  border-radius: 5px;
  font-size: 14px;
`;

const CopyUrlText = styled.span`
  color: #fff;
  font-size: 13px;
  position: absolute;

  top: -20px;
`;

const InvitedFriendItem = styled.div`
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding: 10px 10px;
  border-radius: 5px;
  > img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }
  > span {
    font-size: 18px;
  }
`;

export default TeamPage;
