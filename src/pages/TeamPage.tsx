import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux';
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
import Cs2PlayerRoles from '../consts/Cs2PlayerRoles';

const TeamPage = () => {
  const user = useSelector((state: RootState) => state.userReducer.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const name = useParams().name;
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  useEffect(() => {
    (async () => {
      const team = await fetchTeam(name as string);
      if (typeof team !== 'string') {
        setCurrentTeam(team as Team);
      }
      setIsLoading(false);
    })();
  }, []);
  const ownerRole: Cs2Role = Cs2PlayerRoles.find((role) => role.name === currentTeam?.ownerRole) as Cs2Role;
  return currentTeam === null ? (
    <Loader />
  ) : (
    <Main>
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

            <TeamHeaderButtons>
              <CommonButton>
                <img src={linkIcon} alt='' />
                Скопировать ссылку
              </CommonButton>

              <CommonButton>
                {' '}
                <img src={groupInviteIcon} alt='' />
                Пригласить друзей
              </CommonButton>
            </TeamHeaderButtons>
          </TeamHeaderData>
        </Container>
      </TeamHeader>
      <Container>
        <NeededPlayersRow>
          <p>Нужные игроки:</p>
          <NeededPlayersList>
            {currentTeam.neededRoles.length > 0 ? (
              currentTeam.neededRoles.map((role) => (
                <RoleLable>
                  <img src={rolesIcons.get(role.id)} alt='' />
                  {role.name}
                </RoleLable>
              ))
            ) : (
              <></>
            )}
          </NeededPlayersList>
        </NeededPlayersRow>
        <MembersSectionTitle>
          Участники ({currentTeam.members.length + 1}) &nbsp; &nbsp; &nbsp;ELO в среднем:{' '}
          {Math.floor(
            ((currentTeam.user.cs2_data?.elo as number) +
              currentTeam.members.reduce((start, member) => (member.user.cs2_data?.elo as number) + start, 0)) /
              (currentTeam.members.length + 1),
          )}
        </MembersSectionTitle>
        <MembersAndDescription>
          <MembersSection>
            <MembersList>
              <MemberItem
                onClick={() => {
                  navigate(`/profile/${currentTeam.user.nickname}`);
                }}
              >
                <MemberItemHeader>
                  <MemberAvatar src={isDefaultAvatar(currentTeam.user.user_avatar as string)} alt='' />
                  <div>
                    <div>
                      <MemberLvl src={currentTeam.user.cs2_data?.lvlImg} alt='' />
                      <span> {currentTeam.user.cs2_data?.elo} elo </span>
                    </div>

                    <span>{currentTeam.user.nickname}</span>
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
                <MemberItem
                  key={member.id}
                  onClick={() => {
                    navigate(`/profile/${member.user.nickname}`);
                  }}
                >
                  <MemberItemHeader>
                    <MemberAvatar src={isDefaultAvatar(member.user.user_avatar as string)} alt='' />
                    <div>
                      <div>
                        <MemberLvl src={member.user.cs2_data?.lvlImg} alt='' />
                        <span> {member.user.cs2_data?.elo} elo </span>
                      </div>

                      <span>{member.user.nickname}</span>
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

const MembersSectionTitle = styled.h4`
  width: 100%;
  border-bottom: 1px solid #919191;
  padding-bottom: 10px;
  margin-block: 20px;
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
  &:hover {
    background-color: #3d3d3d;
    cursor: pointer;
    ${RoleLable} {
      opacity: 0.7;
    }
  }
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

export default TeamPage;
