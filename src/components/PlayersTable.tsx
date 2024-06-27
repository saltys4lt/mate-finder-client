import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import styled from 'styled-components';
import { DatePicker } from '@mui/x-date-pickers';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/firebase';
import CommonButton from './UI/CommonButton';
import dayjs, { Dayjs } from 'dayjs';
import Swal from 'sweetalert2';
import { validateNickname } from '../util/checkNickname';
import { validatePassword } from '../util/checkPassword';
import { validateEmail } from '../util/checkEmail';
import { checkYears } from '../util/checkYears';
import createPlayer from '../redux/adminThunks/createPlayer';
import deletePlayer from '../redux/adminThunks/deletePlayer';
import updatePlayer from '../redux/adminThunks/updatePlayer';
import fetchPlayers from '../redux/adminThunks/fetchPlayers';
import { setSearchFilter, setSearchQuery } from '../redux/adminSlice';
import { changeCheckCs2Data } from '../redux/modalSlice';
import { AdminPlayer } from '../types/AdminPlayer';
import isDefaultAvatar from '../util/isDefaultAvatar';
import editIcon from '../assets/images/edit.png';
import confirmIcon from '../assets/images/confirm-edit.png';
import cancelIcon from '../assets/images/cancel-invite.png';
import deleteIcon from '../assets/images/delete.png';
import { getYears } from '../util/getYears';
import Player from '../types/Player';
import CheckCs2DataModal from './CheckCs2DataModal';

const PlayersTable = () => {
  const [renderPlayers, setRenderPlayers] = useState<AdminPlayer[]>([]);
  const [editPlayer, setEditPlayer] = useState<AdminPlayer | null>(null);
  const [newPlayer, setNewPlayer] = useState<AdminPlayer | null>(null);
  const [selectedUser, setSelectedUser] = useState<Player | null>(null);

  const players = useSelector((state: RootState) => state.adminReducer.players);
  const { filter, sort, gender, cs2_data, desc, user_avatar, searchQuery, searchFilter } = useSelector(
    (state: RootState) => state.adminReducer,
  );
  const currentPage = useSelector((state: RootState) => state.adminReducer.currentPage);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPlayers());
  }, [filter, sort, gender, cs2_data, desc, user_avatar, currentPage]);

  useEffect(() => {
    setRenderPlayers(players);
  }, [players]);

  const startCreatingNewPlayer = () => {
    setNewPlayer({
      nickname: '',
      password: '',
      description: '',
      user_avatar: '',
      birthday: '',
      gender: 'male',
      email: '',
    });
  };

  const checkCs2Data = (player: AdminPlayer) => {
    setSelectedUser(player as Player);
    dispatch(changeCheckCs2Data(true));
  };

  const newPlayerNickname = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewPlayer({ ...newPlayer, nickname: e.target.value } as AdminPlayer);
  };
  const newPlayerPassword = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewPlayer({ ...newPlayer, password: e.target.value } as AdminPlayer);
  };

  const newPlayerDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewPlayer({ ...newPlayer, description: e.target.value } as AdminPlayer);
  };
  const newPlayerEmail = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewPlayer({ ...newPlayer, email: e.target.value } as AdminPlayer);
  };

  const newPlayerGender = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewPlayer({ ...newPlayer, gender: e.target.value } as AdminPlayer);
  };
  const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const avatar = e.target.files[0];
    const storageRef = ref(storage, `avatars/${avatar.name}`);
    await uploadBytes(storageRef, avatar).then(() => {
      getDownloadURL(storageRef).then((url: string) => {
        setNewPlayer({ ...newPlayer, user_avatar: url } as AdminPlayer);
      });
    });
  };

  const finishCreatingPlayer = () => {
    if (newPlayer) {
      if (newPlayer?.nickname.length < 3) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: 'Минимальная длина 6',
        });
        return;
      }
      if (newPlayer?.nickname.length > 15) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: `Максимальная длина 15, ваша длина:${newPlayer.nickname.length}`,
        });
        return;
      }
      if (validateNickname(newPlayer.nickname)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: `Можно использовать только буквы английского алфавита и цифры`,
        });
        return;
      }

      if (newPlayer?.password.length < 6) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в пароле',
          text: 'Минимальная длина 6',
        });
        return;
      }
      if (newPlayer?.password.length > 15) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в пароле',
          text: `Максимальная длина 15, ваша длина:${newPlayer.password.length}`,
        });
        return;
      }
      if (validatePassword(newPlayer.password)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в пароле',
          text: `Можно использовать только буквы английского алфавита и цифры`,
        });
        return;
      }

      if (validateEmail(newPlayer.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в пароле',
          text: `Неправильный формат`,
        });
        return;
      }
      const birth: Dayjs = dayjs(newPlayer.birthday);

      if (!checkYears(birth)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка возроста',
          text: `Минимальный возраст 12 лет`,
        });
        return;
      }
      const age: number = getYears(dayjs(newPlayer.birthday));

      dispatch(createPlayer({ ...newPlayer, age } as AdminPlayer)).then(() => {
        dispatch(fetchPlayers());
      });
    }

    setNewPlayer(null);
  };

  const handleDeletePlayer = async (id: number) => {
    await dispatch(deletePlayer(id));

    await dispatch(fetchPlayers());
  };

  const editPlayerNickname = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditPlayer({ ...editPlayer, nickname: e.target.value } as AdminPlayer);
  };

  const editPlayerDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditPlayer({ ...editPlayer, description: e.target.value } as AdminPlayer);
  };

  const editPlayerEmail = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditPlayer({ ...editPlayer, email: e.target.value } as AdminPlayer);
  };

  const editPlayerGender = (e: ChangeEvent<HTMLSelectElement>) => {
    setEditPlayer({ ...editPlayer, gender: e.target.value } as AdminPlayer);
  };
  const uploadEditAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const avatar = e.target.files[0];
    const storageRef = ref(storage, `avatars/${avatar.name}`);
    await uploadBytes(storageRef, avatar).then(() => {
      getDownloadURL(storageRef).then((url: string) => {
        setEditPlayer({ ...editPlayer, user_avatar: url } as AdminPlayer);
      });
    });
  };

  const finishEditingPlayer = () => {
    if (editPlayer) {
      if (editPlayer?.nickname.length < 3) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: 'Минимальная длина 3',
        });
        return;
      }
      if (editPlayer?.nickname.length > 15) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: `Максимальная длина 15, ваша длина:${editPlayer.nickname.length}`,
        });
        return;
      }
      if (validateNickname(editPlayer.nickname)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: `Можно использовать только буквы английского алфавита и цифры`,
        });
        return;
      }

      if (editPlayer?.password.length < 6) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в пароле',
          text: 'Минимальная длина 6',
        });
        return;
      }

      if (validateEmail(editPlayer.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в почте',
          text: `Неправильный формат`,
        });
        return;
      }
      const birth: Dayjs = dayjs(editPlayer.birthday);

      if (!checkYears(birth)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка возроста',
          text: `Минимальный возраст 12 лет`,
        });
        return;
      }
      const age: number = getYears(dayjs(editPlayer.birthday));
      dispatch(updatePlayer({ ...editPlayer, age } as AdminPlayer)).then(() => {
        dispatch(fetchPlayers());
      });
    }

    setEditPlayer(null);
  };

  const handleChangeSearchFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handleChangeSearchQuery = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const search = async () => {
    dispatch(fetchPlayers());
  };
  return (
    <>
      <CheckCs2DataModal profileUser={selectedUser} />

      <MainContainer>
        <SearchContainer>
          <SearhInput
            placeholder='...'
            value={searchQuery}
            onChange={(e) => {
              handleChangeSearchQuery(e);
            }}
          />
          <SearhButton onClick={search}>Поиск</SearhButton>
          <Select
            value={searchFilter}
            onChange={(e) => {
              handleChangeSearchFilter(e);
            }}
            defaultValue={'nickname'}
          >
            <option value='nickname'>По никнейму</option>
            <option value='email'>По почте</option>
            <option value='description'>По описанию</option>
          </Select>
        </SearchContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Пароль</TableHeader>
                <TableHeader>Никнейм</TableHeader>
                <TableHeader>Почта</TableHeader>

                <TableHeader>Аватар</TableHeader>
                <TableHeader>Описание</TableHeader>
                <TableHeader>Пол</TableHeader>
                <TableHeader>День рождения</TableHeader>
                <TableHeader>Кс данные</TableHeader>
                <TableHeader>Действие</TableHeader>
              </tr>
            </thead>
            <tbody>
              {newPlayer ? (
                <TableRow>
                  <TableCell>New id</TableCell>
                  <TableCell>
                    <EditTextArea
                      defaultValue={newPlayer.password}
                      onChange={(e) => {
                        newPlayerPassword(e);
                      }}
                    ></EditTextArea>
                  </TableCell>
                  <TableCell>
                    <EditTextArea
                      defaultValue={newPlayer.nickname}
                      onChange={(e) => {
                        newPlayerNickname(e);
                      }}
                    ></EditTextArea>
                  </TableCell>
                  <TableCell>
                    <EditTextArea
                      defaultValue={newPlayer.email}
                      onChange={(e) => {
                        newPlayerEmail(e);
                      }}
                    ></EditTextArea>
                  </TableCell>
                  <TableCell>
                    <UserAvatar src={isDefaultAvatar(newPlayer.user_avatar)} />
                    <input
                      id='file__input'
                      className='file__upload__input'
                      type='file'
                      accept='image/png, image/jpeg'
                      onChange={(e) => {
                        uploadAvatar(e);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <EditTextArea
                      defaultValue={newPlayer.description}
                      onChange={(e) => {
                        newPlayerDescription(e);
                      }}
                    ></EditTextArea>
                  </TableCell>
                  <TableCell>
                    <select
                      defaultValue={'male'}
                      onChange={(e) => {
                        newPlayerGender(e);
                      }}
                      value={newPlayer.gender}
                    >
                      <option value='male'>Мужской</option>
                      <option value='female'>Женский</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      format='DD/MM/YYYY'
                      label='Birthday'
                      onChange={(date) => {
                        const birth: string = date?.toString() as string;
                        setNewPlayer({ ...newPlayer, birthday: birth });
                      }}
                    />
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Action
                      src={cancelIcon}
                      alt=''
                      onClick={() => {
                        setNewPlayer(null);
                      }}
                    />
                    <Action
                      src={confirmIcon}
                      alt=''
                      onClick={() => {
                        finishCreatingPlayer();
                      }}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>New id</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>

                  <TableCell>
                    <AddPlayer onClick={() => startCreatingNewPlayer()}>+</AddPlayer>
                  </TableCell>
                </TableRow>
              )}
              {renderPlayers.map((user) =>
                editPlayer?.id === user.id && editPlayer !== null ? (
                  <TableRow key={editPlayer.id}>
                    <TableCell>{editPlayer.id}</TableCell>
                    <TableCell>{editPlayer.password}</TableCell>
                    <TableCell>
                      <EditTextArea
                        defaultValue={editPlayer.nickname}
                        onChange={(e) => {
                          editPlayerNickname(e);
                        }}
                      ></EditTextArea>
                    </TableCell>
                    <TableCell>
                      <EditTextArea
                        defaultValue={editPlayer.email}
                        onChange={(e) => {
                          editPlayerEmail(e);
                        }}
                      ></EditTextArea>
                    </TableCell>
                    <TableCell>
                      <UserAvatar src={editPlayer.user_avatar} />
                      <input
                        id='file__input'
                        className='file__upload__input'
                        type='file'
                        accept='image/png, image/jpeg'
                        onChange={(e) => {
                          uploadEditAvatar(e);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <EditTextArea
                        defaultValue={editPlayer.description}
                        onChange={(e) => {
                          editPlayerDescription(e);
                        }}
                      ></EditTextArea>
                    </TableCell>
                    <TableCell>
                      <select
                        defaultValue={'male'}
                        onChange={(e) => {
                          editPlayerGender(e);
                        }}
                        value={editPlayer.gender}
                      >
                        <option value='male'>Мужской</option>
                        <option value='female'>Женский</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <DatePicker
                        format='DD/MM/YYYY'
                        label='День рождения'
                        defaultValue={dayjs(editPlayer.birthday)}
                        onChange={(date) => {
                          const birth: string = date?.toString() as string;
                          setEditPlayer({ ...editPlayer, birthday: birth });
                        }}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Action
                        src={cancelIcon}
                        alt=''
                        onClick={() => {
                          setEditPlayer(null);
                        }}
                      />
                      <Action
                        src={confirmIcon}
                        alt=''
                        onClick={() => {
                          finishEditingPlayer();
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.nickname}</TableCell>
                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <UserAvatar src={isDefaultAvatar(user.user_avatar)} alt='' />
                    </TableCell>
                    <TableCell>{user.description}</TableCell>
                    <TableCell>{user.gender === 'male' ? 'Мужской' : 'Женский'}</TableCell>
                    <TableCell>{user.birthday}</TableCell>
                    <TableCell>
                      {user.cs2_data ? <CommonButton onClick={() => checkCs2Data(user)}>Просмотр</CommonButton> : 'Нет'}
                    </TableCell>
                    <TableCell>
                      <Action src={editIcon} onClick={() => setEditPlayer(user)} />
                      <Action src={deleteIcon} onClick={() => handleDeletePlayer(user.id as number)} />
                    </TableCell>
                  </TableRow>
                ),
              )}
            </tbody>
          </Table>
        </TableContainer>
      </MainContainer>
    </>
  );
};

const Select = styled.select`
  height: 20px;
  font-size: 14px;
  border: 0;
  margin-left: 10px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const SearchContainer = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  overflow: hidden;
`;

const SearhInput = styled.input`
  padding-inline: 5px;
  border: 0;
  width: 40%;
  height: 25px;
`;

const SearhButton = styled.button`
  border: 0;
  width: 150px;
  height: 25px;
  color: #fff;
  text-transform: uppercase;
  background-color: #eb3d3d;
  &:hover {
    cursor: pointer;
    background-color: #952828;
  }
`;

const TableContainer = styled.div`
  background-color: aliceblue;
  width: 100%;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableHeader = styled.th`
  background-color: #f1f1f1;
  padding: 10px;
  text-align: center;
`;

const TableRow = styled.tr`
  background-color: #ababab;
`;

const TableCell = styled.td`
  max-width: 150px;

  overflow-x: auto;

  border: 1px solid black;
  text-align: center;
`;

const UserAvatar = styled.img`
  border-radius: 50%;
  width: 65px;
  height: 65px;
  object-fit: cover;
`;

const EditTextArea = styled.textarea`
  width: 150px;
  border: 0;
  font-size: 14px;
`;
const AddPlayer = styled.div`
  font-size: 40px;
  cursor: pointer;
`;
const Action = styled.img`
  width: 25px;
  height: 25px;
  object-fit: cover;
  cursor: pointer;
`;

export default PlayersTable;
