import { TextField } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState, useAppDispatch } from '../../redux';
import { changeLoginState, changeRegState } from '../../redux/modalSlice';
import fetchUser from '../../redux/userThunks/fetchUser';
import { ErrorAlert } from './RegistrationForm';
import { useEffect } from 'react';

interface IFormInput {
  password: string;
  nickname: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const loginStatus = useSelector((root: RootState) => root.userReducer.fetchUserStatus);

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await dispatch(fetchUser({ nickname: data.nickname, password: data.password }));
  };
  useEffect(() => {
    if (loginStatus === 'fulfilled') {
      dispatch(changeLoginState(false));
    }
  }, [loginStatus]);

  const switchToRegistration = () => {
    dispatch(changeLoginState(false));
    dispatch(changeRegState(true));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        <h3>Вход</h3>
        <TextField
          {...register('nickname', {
            required: { value: true, message: 'Ник обязателен' },
            maxLength: { value: 10, message: 'Макисмум 10 символов' },
            minLength: { value: 3, message: 'Минимум 3 символа' },
          })}
          size='small'
          label='Логин'
          color='secondary'
          variant='filled'
        ></TextField>
        {errors.nickname?.type === 'required' && <ErrorAlert role='alert'>Логин обязателен</ErrorAlert>}
        {errors.nickname?.type === 'maxLength' && <ErrorAlert role='alert'>Макисмум 10 символов</ErrorAlert>}
        {errors.nickname?.type === 'minLength' && <ErrorAlert role='alert'>Минимум 3 символа</ErrorAlert>}

        <TextField
          type='password'
          {...register('password', {
            required: true,
          })}
          size='small'
          label='Пароль'
          color='secondary'
          variant='filled'
        ></TextField>

        {errors.password?.type === 'required' && <ErrorAlert role='alert'>Пароль обязателен</ErrorAlert>}

        <FormButtons>
          <LoginButton type='submit'>Вход</LoginButton>
          <RegButton onClick={switchToRegistration}>Регистрация</RegButton>
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

const LoginButton = styled.button`
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

const RegButton = styled.button`
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

export default LoginForm;
