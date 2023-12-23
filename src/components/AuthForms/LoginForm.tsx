import { TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import styled from 'styled-components'
import { useAppDispatch } from '../../redux'
import { changeLoginState, changeRegState } from '../../redux/modalSlice'
import Modal from '../Modal'


interface IFormInput {
 
  password:string,
  email:string,
 
}

const LoginForm = () => {


  const {register, handleSubmit}=useForm<IFormInput>()

  const dispatch = useAppDispatch()
  
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data)
    
  }

  const switchToRegistration=() => {
    dispatch(changeLoginState())
    dispatch(changeRegState())
  }

  return (
    
    <form onSubmit={handleSubmit(onSubmit)}>
    <FormContainer>
      <h3>Login</h3>
      <TextField {...register('email',{required:true,pattern:/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/})} size='small'  label='Email' color='secondary' variant='filled'></TextField>
      <TextField type='password' {...register('password',{required:true,maxLength:15,minLength:3})} size='small'  label='Password'  color='secondary' variant='filled'></TextField>
      <FormButtons>
          <LoginButton type='submit'>Welcome back</LoginButton>
          <RegButton onClick={switchToRegistration}>Sign Up</RegButton>
      </FormButtons>
    </FormContainer>
    </form>
   
  )
}


const FormContainer = styled.div`
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
`

const FormButtons=styled.div`
  width: 100%;
  display: flex;
  column-gap: 20px;
`

const LoginButton=styled.button`
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
  transition: all .2s ease-in-out;

    &:hover{
      background-color: #282828;
      transform: scale(1.05);
    }
`

const RegButton=styled.button`
  border: 0;
  padding: 5px 15px;
  border-radius: 3px;
  transition: all .2s ease-in-out;
    
  &:hover{
      background-color: #c3c3c3;
      transform: scale(1.05);
      cursor: pointer;
  }

`

export default LoginForm