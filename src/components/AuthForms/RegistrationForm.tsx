import React, { useState } from 'react'
import styled from 'styled-components'
import { FormControl, TextField,RadioGroup,Radio,FormControlLabel } from '@mui/material'
import makeStyles from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'

import { useForm, SubmitHandler } from "react-hook-form"



interface IFormInput {
  nickname: string,
  password:string,
  email:string,
  birthday:Dayjs,
  gender: string
}

const RegistrationForm = () => {

const [birtday, setbirtday] = useState<Dayjs | null>(dayjs())

const {register, handleSubmit}=useForm<IFormInput>()


const onSubmit: SubmitHandler<IFormInput> = (data) => {
  console.log(data)
}




  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <FormContainer>
      <h3>Registration</h3>
      <TextField {...register('nickname')} size='small' label='Nickname'  color='secondary' variant='filled'></TextField>
      <TextField {...register('password')} size='small'  label='Email' color='secondary' variant='filled'></TextField>
      <TextField {...register('email')} size='small'  label='Password'  color='secondary' variant='filled'></TextField>
      <DatePicker {...register('birthday')} value={birtday} onChange={(newValue)=>setbirtday(newValue)}/>
      <RadioGroup 
        row
      >
        <FormControlLabel value="female" control={<Radio color='secondary'/>} label="Female"  {...register('gender')}/>
        <FormControlLabel value="male" control={<Radio color='secondary'/>} label="Male"  {...register('gender')}/>
      </RadioGroup>
      <FormButtons>
          <RegButton type='submit'>Get started</RegButton>
          <LoginButton>Have an account</LoginButton>
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

const RegButton=styled.button`
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

const LoginButton=styled.button`
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




export default RegistrationForm