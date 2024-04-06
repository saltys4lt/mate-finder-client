import Container from '../components/Container';
import styled from 'styled-components';
import cs2Logo from '../assets/images/cs2-logo.png';
import { ChangeEvent, useState } from 'react';
import Team from '../types/Team';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import ClientUser from '../types/ClientUser';
import CommonButton from '../components/UI/CommonButton';
import CommonInput from '../components/UI/CommonInput';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Select, { SingleValue } from 'react-select';
import { CustomOption, CustomSingleValue, customStyles } from '../components/UI/GameSelect';
import Games from '../consts/Games';
import Option from '../types/Option';
const TeamCreationPage = () => {
  const user = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const [team, setTeam] = useState<Team>({
    name: '',
    avatar: cs2Logo,
    game: 'cs2',
    description: '',
    public: true,
    ownerId: user.id,
    players: [],
  });
  const [game, setGame] = useState<SingleValue<Option>>();

  const handleTeamNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeam({ ...team, name: e.target.value });
  };

  const handleTeamDescChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTeam({ ...team, description: e.target.value });
  };
  const handleTeamTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === 'true') {
      setTeam({ ...team, public: true });
    } else setTeam({ ...team, public: false });
  };

  const handleGameChange = (game: SingleValue<Option>) => {
    setGame(game);
  };
  return (
    <Main>
      <Container>
        <InnerContainer>
          <TeamHeader>
            <TeamLogoContainer>
              <TeamLogo src={team.avatar} alt='team-logo' />
              <input
                style={{ display: 'none' }}
                id='file__input'
                className='file__upload__input'
                type='file'
                accept='image/png, image/jpeg'
                onChange={(e) => {}}
              />
              <UploadLogoButton>Выбрать аватар</UploadLogoButton>
            </TeamLogoContainer>
            <MainHeaderData>
              <TeamData>
                <TeamDataText>Игра</TeamDataText>
                <Select
                  maxMenuHeight={130}
                  styles={{
                    ...customStyles,
                    control: (base: any) => ({
                      ...base,
                      width: '300px',
                      background: '#181818',
                      boxShadow: '0',
                      borderColor: '#484848',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#808080',
                      },
                    }),
                  }}
                  options={Games}
                  value={game}
                  onChange={handleGameChange}
                  components={{
                    Option: CustomOption,
                    SingleValue: CustomSingleValue,
                  }}
                  placeholder='Выбор игры'
                ></Select>
              </TeamData>
              <TeamData>
                <TeamDataText>Название: </TeamDataText>
                <CommonInput onChange={handleTeamNameChange} placeholder='...' value={team.name} style={{ maxWidth: '300px' }} />
              </TeamData>
              <TeamData>
                <TeamDataText>Информация: </TeamDataText>
                <DescriptionInput onChange={handleTeamDescChange} placeholder='Кто вы, что вы и зачем ' value={team.description} />
              </TeamData>
              <TeamData>
                <TeamDataText style={{ display: 'flex', columnGap: '5px', position: 'relative' }}>
                  <span>Публичная / Приватная:</span>
                  <ErrorOutlineContainer>
                    <ErrorOutline />
                    <TypeExplenation>
                      Приватные команды не видны другим игрокам в глобальном поиске. Вы сможете собрать команду только приглашая их
                      самостоятельно.
                    </TypeExplenation>
                  </ErrorOutlineContainer>
                </TeamDataText>
                <RadioGroup
                  style={{ color: 'var(--main-text-color)' }}
                  row
                  defaultValue={'any'}
                  value={team.public}
                  onChange={(e) => handleTeamTypeChange(e)}
                >
                  <FormControlLabel value='true' control={<Radio color='error' />} label='Публичная' />
                  <FormControlLabel value='false' control={<Radio color='error' />} label='Приватная' />
                </RadioGroup>
              </TeamData>
            </MainHeaderData>
          </TeamHeader>
        </InnerContainer>
      </Container>
    </Main>
  );
};

const Main = styled.main`
  padding-block: 20px;
`;

const InnerContainer = styled.div`
  background-color: #252525;
  width: 100%;

  border-radius: 15px;
  padding: 25px;
`;

const TeamHeader = styled.div`
  width: 100%;
  display: flex;

  justify-content: space-between;
`;

const TeamLogoContainer = styled.div`
  width: 28%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
`;

const TeamLogo = styled.img`
  max-width: 200px;
  border-radius: 10px;
`;
const UploadLogoButton = styled(CommonButton)``;
const MainHeaderData = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const TypeExplenation = styled.p`
  display: none;
  width: 200px;
  font-size: 14px;
  font-weight: 400;
  position: absolute;
  top: -10em;
  right: -10em;
  background-color: #333333;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 1px 10px #333333;
`;

const TeamDataText = styled.h4`
  font-size: 18px;
  color: var(--main-text-color);
`;
const TeamData = styled.div`
  display: flex;
  row-gap: 10px;
  flex-direction: column;
`;

const DescriptionInput = styled.textarea`
  font-size: 16px;
  padding: 10px 15px;
  color: var(--main-text-color);

  background-color: #181818;

  min-height: 220px;
  border-radius: 5px;
  border: 2px solid #565656;

  resize: none;
  &::placeholder {
    font-size: 15px;
  }
`;

const ErrorOutlineContainer = styled.div`
  position: relative;
  cursor: help;
  &:hover ${TypeExplenation} {
    display: block;
    z-index: 10;
  }
`;

const ErrorOutline = styled(ErrorOutlineIcon)``;

export default TeamCreationPage;
