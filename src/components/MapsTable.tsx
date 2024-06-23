import { ChangeEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { validateNickname } from '../util/checkNickname';
import editIcon from '../assets/images/edit.png';
import confirmIcon from '../assets/images/confirm-edit.png';
import cancelIcon from '../assets/images/cancel-invite.png';
import deleteIcon from '../assets/images/delete.png';
import fetchAllMaps from '../redux/adminThunks/fetchAllMaps';
import createMap from '../redux/adminThunks/createMap';
import deleteMap from '../redux/adminThunks/deleteMap';
import updateMap from '../redux/adminThunks/updateMap';

const MapsTable = () => {
  const [renderMaps, setRenderMaps] = useState<any[]>([]);
  const [editMap, setEditMap] = useState<any | null>(null);
  const [newMap, setNewMap] = useState<any | null>(null);
  const [searchQuery, setsearchQuery] = useState<string>('');
  const maps = useSelector((state: RootState) => state.adminReducer.maps);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllMaps(searchQuery));
  }, []);

  useEffect(() => {
    setRenderMaps(maps);
  }, [maps]);

  const startCreatingNewMap = () => {
    setNewMap({
      name: '',
    });
  };

  const ChangeNewMapName = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewMap({ name: e.target.value });
  };

  const finishCreatingCreatingMap = () => {
    console.log(newMap);
    if (newMap) {
      if (newMap?.name.length < 3) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: 'Минимальная длина 3',
        });
        return;
      }
      if (newMap?.name.length > 15) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: `Максимальная длина 15, ваша длина:${newMap.name.length}`,
        });
        return;
      }
      if (validateNickname(newMap.name)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: `Можно использовать только буквы английского алфавита и цифры`,
        });
        return;
      }
      dispatch(createMap(newMap.name));
      dispatch(fetchAllMaps(searchQuery));
    }

    setNewMap(null);
  };

  const finishEditingMap = () => {
    if (editMap) {
      if (editMap?.name.length < 3) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: 'Минимальная длина 3',
        });
        return;
      }
      if (editMap?.name.length > 15) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: `Максимальная длина 15, ваша длина:${editMap.name.length}`,
        });
        return;
      }
      if (validateNickname(editMap.name)) {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка в нике',
          text: `Можно использовать только буквы английского алфавита и цифры`,
        });
        return;
      }
    }
    dispatch(updateMap({ id: editMap.id, name: editMap.name }));
    setEditMap(false);
  };

  const search = async () => {
    dispatch(fetchAllMaps(searchQuery));
  };

  console.log(editMap);

  return (
    <>
      <MainContainer>
        <SearchContainer>
          <SearhInput
            placeholder='...'
            value={searchQuery}
            onChange={(e) => {
              setsearchQuery(e.target.value);
            }}
          />
          <SearhButton onClick={search}>Поиск</SearhButton>
        </SearchContainer>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader>ID</TableHeader>
                <TableHeader>Название карты</TableHeader>
                <TableHeader>Действия</TableHeader>
              </tr>
            </thead>
            <tbody>
              {newMap ? (
                <TableRow>
                  <TableCell>New id</TableCell>
                  <TableCell>
                    <EditTextArea
                      defaultValue={newMap.name}
                      onChange={(e) => {
                        ChangeNewMapName(e);
                      }}
                    ></EditTextArea>
                  </TableCell>
                  <TableCell>
                    <Action
                      src={cancelIcon}
                      alt=''
                      onClick={() => {
                        setNewMap(null);
                      }}
                    />
                    <Action
                      src={confirmIcon}
                      alt=''
                      onClick={() => {
                        finishCreatingCreatingMap();
                      }}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>New id</TableCell>
                  <TableCell></TableCell>

                  <TableCell>
                    <AddPlayer onClick={() => startCreatingNewMap()}>+</AddPlayer>
                  </TableCell>
                </TableRow>
              )}
              {renderMaps.map((map) =>
                editMap?.id === map.id && editMap !== null ? (
                  <TableRow key={map.id}>
                    <TableCell>{map.id}</TableCell>

                    <TableCell>
                      <EditTextArea
                        value={editMap.name}
                        onChange={(e) => {
                          setEditMap({ ...editMap, name: e.target.value });
                        }}
                      ></EditTextArea>
                    </TableCell>

                    <TableCell>
                      <Action
                        src={cancelIcon}
                        alt=''
                        onClick={() => {
                          setEditMap(null);
                        }}
                      />
                      <Action src={confirmIcon} alt='' onClick={finishEditingMap} />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={map.id}>
                    <TableCell>{map.id}</TableCell>
                    <TableCell>{map.name}</TableCell>

                    <TableCell>
                      <Action src={editIcon} onClick={() => setEditMap(map)} />
                      <Action src={deleteIcon} onClick={() => dispatch(deleteMap(map.id as number))} />
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

const MainContainer = styled.div`
  width: 100%;
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

export default MapsTable;
