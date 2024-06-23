import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux';
import { changeLoginState, changeRegState } from '../../redux/modalSlice';
import { resetUserStatus } from '../../redux/userSlice';
import createUser from '../../redux/userThunks/createUser';
import User from '../../types/User';
import { checkYears } from '../../util/checkYears';
import { getYears } from '../../util/getYears';

interface IFormInput {
  nickname: string;
  password: string;
  email: string;
  birthday: Dayjs;
  gender: string;
}

const RegistrationForm = () => {
  const [birthday, setBirthday] = useState<Dayjs | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormInput>();

  const dispatch = useAppDispatch();

  const createUserStatus = useSelector((state: RootState) => state.userReducer.createUserStatus);

  useEffect(() => {
    if (createUserStatus === 'fulfilled') {
      dispatch(resetUserStatus());
      switchToLogin();
    }
    if (createUserStatus === 'rejected') {
      dispatch(resetUserStatus());
    }
  }, [createUserStatus]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (data.birthday) if (!checkYears(data.birthday)) return;
    const age: number = getYears(data.birthday);
    const newUser: User = {
      nickname: data.nickname,
      password: data.password,
      email: data.email,
      gender: data.gender,
      birthday: data.birthday.toString(),
      age,
    };
    await dispatch(createUser(newUser));
  };

  const switchToLogin = () => {
    dispatch(changeRegState(false));
    dispatch(changeLoginState(true));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        <h3>Регистрация</h3>
        <TextField
          {...register('nickname', {
            required: { value: true, message: 'Логин обязателен' },
            maxLength: { value: 10, message: 'Максимум 10 символов' },
            minLength: { value: 3, message: 'Минимум 3 символа' },
          })}
          size='small'
          label='Логин'
          color='secondary'
          variant='filled'
        ></TextField>
        {errors.nickname?.type === 'required' && <ErrorAlert role='alert'>{errors.nickname.message}</ErrorAlert>}
        {errors.nickname?.type === 'maxLength' && <ErrorAlert role='alert'>{errors.nickname.message}</ErrorAlert>}
        {errors.nickname?.type === 'minLength' && <ErrorAlert role='alert'>{errors.nickname.message}</ErrorAlert>}

        <TextField
          {...register('email', {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: 'Неверный формат почты',
            },
          })}
          size='small'
          label='Почта'
          color='secondary'
          variant='filled'
        ></TextField>
        {errors.email?.type === 'required' && <ErrorAlert role='alert'>Почта обязательна</ErrorAlert>}
        {errors.email?.type === 'pattern' && <ErrorAlert role='alert'>{errors.email.message}</ErrorAlert>}

        <TextField
          type='password'
          {...register('password', {
            required: true,
            maxLength: 15,
            minLength: 6,
          })}
          size='small'
          label='Пароль'
          color='secondary'
          variant='filled'
        ></TextField>
        {errors.password?.type === 'required' && <ErrorAlert role='alert'>Пароль обязателен</ErrorAlert>}
        {errors.password?.type === 'maxLength' && <ErrorAlert role='alert'>Максимум 15 символов</ErrorAlert>}
        {errors.password?.type === 'minLength' && <ErrorAlert role='alert'>Минимум 6 символов</ErrorAlert>}
        <DatePicker
          format='DD/MM/YYYY'
          label='Дата рождения'
          value={birthday}
          onChange={(date) => {
            setBirthday(date);
            setValue('birthday', date as Dayjs);
          }}
        />
        {birthday && !checkYears(birthday) ? <ErrorAlert role='alert'>Минимальный возрост 12 лет</ErrorAlert> : ''}

        <RadioGroup row defaultValue={'male'}>
          <FormControlLabel
            value='male'
            control={<Radio color='secondary' {...register('gender', { required: true })} />}
            label='Мужской'
          />
          <FormControlLabel
            value='female'
            control={<Radio color='secondary' {...register('gender', { required: true })} />}
            label='Женский'
          />
        </RadioGroup>
        {errors.gender?.type === 'required' && <ErrorAlert role='alert'>Пол обязателен</ErrorAlert>}
        <FormButtons>
          <RegButton type='submit'>Начнем</RegButton>
          <LoginButton onClick={switchToLogin}>Уже есть аккаунт</LoginButton>
        </FormButtons>
      </FormContainer>
    </form>
  );
};

const FormContainer = styled.div`
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
`;

const FormButtons = styled.div`
  width: 100%;
  display: flex;
  column-gap: 20px;
`;

const RegButton = styled.button`
  font-weight: 700;
  font-size: 14px;
  font-family: montserrat;
  text-transform: uppercase;
  color: #fff;
  padding: 5px 15px;
  border-radius: 4px;
  background-size: 100%;
  background-color: #df1818;
  height: 40px;

  border: 0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #282828;
    transform: scale(1.05);
  }
`;

const LoginButton = styled.button`
  border: 0;
  padding: 5px 15px;
  border-radius: 3px;
  transition: all 0.2s ease-in-out;
  background-color: #e1e1e1;
  border: 1px solid #969696;
  &:hover {
    background-color: #c3c3c3;
    transform: scale(1.05);
    cursor: pointer;
  }
`;

export const ErrorAlert = styled.span`
  margin-top: -10px;
  font-size: 12px;
  color: #d82f2f;
`;

export default RegistrationForm;
