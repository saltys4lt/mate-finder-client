import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux';
import { changeLoginState, changeRegState } from '../../redux/modalSlice';
import { resetUserStatus } from '../../redux/usersSlice';
import createUser from '../../redux/userThunks/createUser';
import User from '../../types/User';
import { checkYears } from '../../util/checkYears';

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

    const newUser: User = {
      nickname: data.nickname,
      password: data.password,
      email: data.email,
      gender: data.gender,
      birthday: data.birthday.toString(),
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
        <h3>Registration</h3>
        <TextField
          {...register('nickname', {
            required: { value: true, message: 'nickname is required' },
            maxLength: { value: 10, message: 'max length is 10' },
            minLength: { value: 3, message: 'min length is 3' },
          })}
          size='small'
          label='Nickname'
          color='secondary'
          variant='filled'
        ></TextField>
        {errors.nickname?.type === 'required' && <ErrorAlert role='alert'>Nickname is required</ErrorAlert>}
        {errors.nickname?.type === 'maxLength' && <ErrorAlert role='alert'>Max length is 10</ErrorAlert>}
        {errors.nickname?.type === 'minLength' && <ErrorAlert role='alert'>Min length is 3</ErrorAlert>}

        <TextField
          {...register('email', {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: 'Incorrect email',
            },
          })}
          size='small'
          label='Email'
          color='secondary'
          variant='filled'
        ></TextField>
        {errors.email?.type === 'required' && <ErrorAlert role='alert'>Email is required</ErrorAlert>}
        {errors.email?.type === 'pattern' && <ErrorAlert role='alert'>{errors.email.message}</ErrorAlert>}

        <TextField
          type='password'
          {...register('password', {
            required: true,
            maxLength: 15,
            minLength: 6,
          })}
          size='small'
          label='Password'
          color='secondary'
          variant='filled'
        ></TextField>
        {errors.password?.type === 'required' && <ErrorAlert role='alert'>Password is required</ErrorAlert>}
        {errors.password?.type === 'maxLength' && <ErrorAlert role='alert'>Max length is 15</ErrorAlert>}
        {errors.password?.type === 'minLength' && <ErrorAlert role='alert'>Min length is 6</ErrorAlert>}
        <DatePicker
          format='DD/MM/YYYY'
          label='Birthday'
          value={birthday}
          onChange={(date) => {
            setBirthday(date);
            setValue('birthday', date as Dayjs);
          }}
        />
        {birthday && dayjs().year() - birthday.year() < 10 ? <ErrorAlert role='alert'>Min age is 12</ErrorAlert> : ''}

        <RadioGroup row defaultValue={'male'}>
          <FormControlLabel value='male' control={<Radio color='secondary' {...register('gender', { required: true })} />} label='Male' />
          <FormControlLabel
            value='female'
            control={<Radio color='secondary' {...register('gender', { required: true })} />}
            label='Female'
          />
        </RadioGroup>
        {errors.gender?.type === 'required' && <ErrorAlert role='alert'>Gender is required</ErrorAlert>}
        <FormButtons>
          <RegButton type='submit'>Get started</RegButton>
          <LoginButton onClick={switchToLogin}>Have an account</LoginButton>
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

  &:hover {
    background-color: #c3c3c3;
    transform: scale(1.05);
    cursor: pointer;
  }
`;

export const ErrorAlert = styled.span`
  margin: -10px;
  font-size: 12px;
  color: #d82f2f;
`;

export default RegistrationForm;
