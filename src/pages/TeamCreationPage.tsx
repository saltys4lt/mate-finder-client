import Container from '../components/Container';
import styled from 'styled-components';
import cs2Logo from '../assets/images/cs2-logo.png';
import { ChangeEvent, useState, useEffect } from 'react';
import Team from '../types/Team';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import ClientUser from '../types/ClientUser';

import CommonInput from '../components/UI/CommonInput';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { CircularProgress, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Select, { SingleValue } from 'react-select';
import { CustomOption, CustomSingleValue, customStyles } from '../components/UI/GameSelect';
import Games from '../consts/Games';
import Option from '../types/Option';
import { checkUserGameProfile } from '../util/checkUserGameProfile';
import cs2CreationBg from '../assets/images/cs-creation-bg.webp';
import editIcon from '../assets/images/edit.png';
import uploadTeamAvatar from '../api/uploadTeamAvatar';
import Swal from 'sweetalert2';

const TeamCreationPage = () => {
  const user = useSelector((state: RootState) => state.userReducer.user) as ClientUser;
  const [availableGames, setAvailableGames] = useState<Option[]>(Games);
  const [avatarIsLoading, setAvatarIsLoading] = useState<boolean>(false);
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
  const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setAvatarIsLoading(true);
    if (e.target.files[0].size > 500 * 1024) {
      Swal.fire({
        icon: 'error',
        titleText: 'Ошибка размера!',
        text: 'Ваш файл превышает размер в 500 кб',
        confirmButtonText: 'Понятно',
      });
      return;
    }
    const avatar = e.target.files[0];
    const formData = new FormData();
    console.log('Размер' + avatar.size);
    formData.append('avatar', avatar);
    console.log(formData);

    uploadTeamAvatar(formData)
      .then((res) => {
        setTeam({ ...team, avatar: res as string });
        setAvatarIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
  useEffect(() => {
    if (checkUserGameProfile(user as ClientUser) === 2) {
      setGame({ image: '', label: 'Выберите игру', value: 'both' } as Option);
    }
    if (checkUserGameProfile(user as ClientUser) === 1) {
      setGame(Games[0]);
      setAvailableGames([Games[0]]);
    }
    if (checkUserGameProfile(user as ClientUser) === 0) {
      setGame(Games[1]);
      setAvailableGames([Games[1]]);
    }

    return () => {};
  }, []);

  const openFileExplorer = () => {
    document.getElementById('file__input')?.click();
  };

  return (
    <Main>
      <Container>
        <InnerContainer>
          <TeamLogoContainer>
            <TeamData>
              <TeamDataText>Логотип: </TeamDataText>

              <TeamLogo>
                <TeamLogoImg loading={avatarIsLoading.toString()} src={team.avatar} />
                <ChangeAvatarButton loading={avatarIsLoading.toString()} disabled={avatarIsLoading} onClick={openFileExplorer}>
                  <ChangeAvatarButtonIcon src={editIcon} alt='' />
                </ChangeAvatarButton>
                {avatarIsLoading && (
                  <CircularProgress
                    color='error'
                    size={'50px'}
                    sx={{
                      zIndex: 3,
                      position: 'absolute',
                      inset: '0',
                      margin: 'auto',
                    }}
                  />
                )}
              </TeamLogo>
            </TeamData>

            <input
              style={{ display: 'none' }}
              id='file__input'
              className='file__upload__input'
              type='file'
              accept='image/png, image/jpeg, image/webp'
              onChange={(e) => {
                uploadAvatar(e);
              }}
            />

            <TeamData>
              <TeamDataText>Название: </TeamDataText>
              <CommonInput onChange={handleTeamNameChange} placeholder='...' value={team.name} style={{ maxWidth: '300px' }} />
            </TeamData>
            <TeamData>
              <TeamDataText>Информация: </TeamDataText>
              <DescriptionInput onChange={handleTeamDescChange} placeholder='Кто вы, что вы и зачем ' value={team.description} />
            </TeamData>
          </TeamLogoContainer>
          <MainData>
            <TeamData>
              <TeamDataText>Игра</TeamDataText>
              <Select
                maxMenuHeight={130}
                isSearchable={false}
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
                options={availableGames}
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
              <TeamDataText style={{ display: 'flex', columnGap: '5px', position: 'relative' }}>
                <span>Публичная / Приватная:</span>
                <ErrorOutlineContainer>
                  <ErrorOutline />
                  <TypeExplenation>
                    Приватные команды не видны другим игрокам в глобальном поиске. Вы сможете собрать команду только приглашая игроков
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
                <FormControlLabel
                  value='true'
                  control={
                    <Radio
                      sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: 'red',
                        },
                      }}
                    />
                  }
                  label='Публичная'
                />
                <FormControlLabel
                  value='false'
                  control={
                    <Radio
                      sx={{
                        color: 'grey',
                        '&.Mui-checked': {
                          color: 'red',
                        },
                      }}
                    />
                  }
                  label='Приватная'
                />
              </RadioGroup>
            </TeamData>
          </MainData>
        </InnerContainer>
      </Container>
    </Main>
  );
};

const Main = styled.main`
  padding-block: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('${cs2CreationBg}');
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(10px);
    z-index: -1;
  }
`;

const InnerContainer = styled.div`
  background-color: #252525;
  width: 100%;
  display: flex;
  justify-content: space-around;
  border-radius: 15px;
  padding: 25px;
`;

const TeamLogoContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;

  row-gap: 20px;
`;

const TeamLogo = styled.div`
  width: fit-content;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const TeamLogoImg = styled.img<{ loading: string }>`
  max-width: 200px;
  border-radius: 10px;
  opacity: ${(p) => (p.loading === 'true' ? '0.4' : '1')};
`;
const ChangeAvatarButton = styled.button<{ loading: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  padding: 12px;
  background-color: #323232;
  border-radius: 50%;
  right: -10px;
  bottom: -10px;
  cursor: pointer;
  opacity: ${(p) => (p.loading === 'true' ? '0.4' : '1')};
  position: absolute;
  transition: background-color 0.2s ease-in-out;
  border: 2px solid #fff;
  &:hover {
    background-color: #535353;
  }
`;
const ChangeAvatarButtonIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: invert(1);
`;

const MainData = styled.div`
  width: 50%;
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
  width: 100%;
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
