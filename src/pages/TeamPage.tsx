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
        </Container>
      </TeamHeader>
    </Main>
  );
};

const Main = styled.main`
  flex: 1;
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
  z-index: 1; // увеличиваем z-index
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
const NeededPlayersRow = styled.div`
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
  align-items: center;
  column-gap: 15px;
`;
const RoleLable = styled(CommonButton)`
  &:hover {
    background-color: #181818;
    border-color: #565656;
  }
  span {
    font-weight: 700;
    color: #dbdbdb;
  }
`;
export default TeamPage;
