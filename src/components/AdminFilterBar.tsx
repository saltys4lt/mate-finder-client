import { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../redux';
import { useAppDispatch } from '../redux';
import { setCs2_data, setDesc, setFilter, setGender, setSort, setUser_Avatar } from '../redux/adminSlice';
const AdminFilterBar = () => {
  const dispatch = useAppDispatch();
  const { filter, sort, gender, cs2_data, desc, user_avatar } = useSelector((state: RootState) => state.adminReducer);
  const player = {
    id: 1,
    nickname: 'nickname',
    email: 'email@example.com',
    description: 'description',
    gender: 'male',
    birthday: '2000-01-01',
  };
  const handleChangeGender = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'male' || e.target.value === 'female' || e.target.value === '') dispatch(setGender(e.target.value));
  };

  const handleChangeFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilter(e.target.value));
  };

  const handleChangeSort = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'asc' || e.target.value === 'desc') dispatch(setSort(e.target.value));
  };

  const handleChangeCs2Data = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setCs2_data(e.target.checked));
  };

  const handleChangeUser_avatar = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setUser_Avatar(e.target.checked));
  };

  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setDesc(e.target.checked));
  };
  const translationMap = new Map([
    ['id', 'id'],
    ['nickname', 'никнейм'],
    ['email', 'электронная почта'],
    ['description', 'описание'],
    ['gender', 'пол'],
    ['birthday', 'день рождения'],
  ]);
  return (
    <FilterBarContainer>
      <div>
        <h3>Столбец</h3>
        <select value={filter} onChange={(e) => handleChangeFilter(e)}>
          {Object.keys(player).map((key, index) => (
            <option key={index} value={key}>
              {translationMap.get(key)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3>Возростание/убывание</h3>
        <select onChange={(e) => handleChangeSort(e)} value={sort}>
          <option value='asc'>возростание</option>
          <option value='desc'>убывание</option>
        </select>
      </div>

      <div>
        <h3>Пол</h3>
        <select onChange={(e) => handleChangeGender(e)} value={gender}>
          <option value='male'>мужской</option>
          <option value='female'>женский</option>
          <option value=''>любой</option>
        </select>
      </div>

      <div>
        <h3>Наличие</h3>
        <div>
          <div>
            <input onChange={(e) => handleChangeCs2Data(e)} type='checkbox' checked={cs2_data} />
            <label>Кс данные</label>
          </div>

          <div>
            <input onChange={(e) => handleChangeUser_avatar(e)} type='checkbox' checked={user_avatar} />
            <label>Аватар</label>
          </div>
          <div>
            <input onChange={(e) => handleChangeDescription(e)} type='checkbox' checked={desc} />
            <label>Описание</label>
          </div>
        </div>
      </div>
    </FilterBarContainer>
  );
};

const FilterBarContainer = styled.div`
  width: 15%;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: aliceblue;
  height: 100%;
  h3 {
    font-size: 14px;
  }
`;

export default AdminFilterBar;
