import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';

import styled from 'styled-components';

import closeCross from '../assets/images/close-cross.png';
import { changeCheckCs2Data } from '../redux/modalSlice';

import MapsImages from '../consts/MapsImages';
import { FC } from 'react';
import ClientUser from '../types/ClientUser';

interface ModalStatus {
  $active: string;
}

interface Props {
  profileUser: ClientUser | null;
}

const CheckCs2DataModal: FC<Props> = ({ profileUser }) => {
  const isActive = useSelector((state: RootState) => state.modalReducer.checkCs2Data);
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(changeCheckCs2Data(false));
  };

  return (
    profileUser && (
      <ModalContainer $active={String(isActive)}>
        <Content>
          <InnerContent>
            <CloseCross src={closeCross} onClick={handleClose} />
            <Cs2Stats>
              <>
                <Cs2StatsHeader>
                  <Cs2StatsText>
                    Уровень: <img src={profileUser?.cs2_data?.lvlImg} alt='' />
                  </Cs2StatsText>
                  <Cs2StatsText>{profileUser?.cs2_data?.elo}&nbsp;elo</Cs2StatsText>
                </Cs2StatsHeader>
                <Cs2StatsMain>
                  <Cs2StatsText>
                    Матчи: &nbsp;<span>{profileUser?.cs2_data?.matches}</span>
                  </Cs2StatsText>
                  <Cs2StatsText>
                    Победы: &nbsp;<span>{profileUser?.cs2_data?.wins}</span>
                  </Cs2StatsText>
                  <Cs2StatsText>
                    Процент побед: &nbsp;<span>{profileUser?.cs2_data?.winrate} %</span>
                  </Cs2StatsText>
                  <Cs2StatsText>
                    КД: &nbsp;<span>{profileUser?.cs2_data?.kd}</span>
                  </Cs2StatsText>
                  <Cs2StatsText>
                    Убийств в голову: &nbsp;<span>{profileUser?.cs2_data?.hs} %</span>
                  </Cs2StatsText>
                </Cs2StatsMain>

                <RolesContainer>
                  <Cs2StatsText>Роли:</Cs2StatsText>
                  <Roles>{profileUser?.cs2_data?.roles?.map((role) => <Role key={role.cs2Role.name}>{role.cs2Role.name}</Role>)}</Roles>
                </RolesContainer>

                <MapsContainer>
                  <Cs2StatsText>Избранные карты:</Cs2StatsText>
                  <Maps>
                    {profileUser?.cs2_data?.maps?.map((map) => <img key={MapsImages[map.cs2Map.name]} src={MapsImages[map.cs2Map.name]} />)}
                  </Maps>
                </MapsContainer>
              </>
            </Cs2Stats>
          </InnerContent>
        </Content>
      </ModalContainer>
    )
  );
};
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
  padding-top: 35px;
  border-radius: 12px;
  background-color: #393939;
  width: 900px;
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

const Cs2Stats = styled.div`
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const Cs2StatsHeader = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
  column-gap: 15px;
`;
const Cs2StatsMain = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  flex-wrap: wrap;
  column-gap: 3%;
  row-gap: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #333;
`;
const RolesContainer = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #333;
  flex-wrap: wrap;
  @media (max-width: 980px) {
    flex-wrap: wrap;
  }
  &:last-child {
    padding: 0;
    border: 0;
  }
`;
const MapsContainer = styled(RolesContainer)``;

const Cs2StatsText = styled.p`
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

  img {
    margin-left: 10px;
    width: 45px;
  }
`;

const Roles = styled.div`
  display: flex;
  column-gap: 20px;
`;

const Role = styled.div`
  color: #fff;
`;

const Maps = styled(Roles)`
  img {
    width: 100px;
    border-radius: 5px;
  }
`;
export default CheckCs2DataModal;
