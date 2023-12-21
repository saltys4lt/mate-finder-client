import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useAppDispatch, RootState } from '../redux'
import { changeLoginState, changeRegState } from '../redux/modalSlice'







const Navbar = () => {
  const dispatch=useAppDispatch()
const regIsActive=useSelector((state:RootState)=>state.modalReducer.regIsActive)
const loginIsActive=useSelector((state:RootState)=>state.modalReducer.loginIsActive)

  const openRegModal=() => {
    dispatch(changeRegState())
  }


  const openLoginModal=() => {
    dispatch(changeLoginState())
  }

  return (
    <NavbarContainer>
        <LogoWrapper>
            <LogoImage src='/images/header1-logo.jpeg'/>
            <LogoText>Squad 
               <LogoTextSpan>
                Link
               </LogoTextSpan>
            </LogoText>
        </LogoWrapper>
        <AuthButtons>
      <LoginButton onClick={openLoginModal}>login</LoginButton>
      <RegistrationButton onClick={openRegModal}>sign up</RegistrationButton>
      
        </AuthButtons>
    </NavbarContainer>
  )
}



const NavbarContainer = styled.nav`

    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 60px;
`

const AuthButtons = styled.div`
    display: flex;
    column-gap: 10px;
`
const LoginButton =styled.button`
    font-weight: 500;
    font-size: 16px;
    font-family: montserrat;

    text-transform: uppercase;
    color: #fff;
    padding: 5px 16px;
    border-radius: 4px;
    background-color: transparent;
        height: 32px;
    width: 160px;
  border: 1px solid #fff;
  cursor: pointer;
  transition: all .2s ease-in-out;
  &:hover{
      transform: scale(1.05);
      background-color: #3e3e3e;
    }
`

const RegistrationButton =styled.button`
      font-weight: 500;
    font-size: 16px;
    font-family: montserrat;
    text-transform: uppercase;
    color: #fff;
    padding: 5px 16px;
    border-radius: 4px;
    background: radial-gradient(circle at 10% 20%, rgb(197, 84, 76) 0%, rgb(73, 57, 57) 100.7%);
    background-size: 100%;
    height: 32px;

    width: 160px;
    border: 1px solid #000000;
    cursor: pointer;
  transition: all .2s ease-in-out;

    &:hover{
      background-size: 150%;
      transform: scale(1.05);
    }
`

const LogoWrapper=styled.div`
  display: flex;
  align-items: center;
`

const LogoImage=styled.img`
  height: 60px;
  border-radius: 5px;
`
const LogoText=styled.h1`
margin-left: 20px;
  font-size: 28px; /* Размер текста */
  background: linear-gradient(45deg, #f33e3e, #949494);
  -webkit-background-clip: text; /* Применение градиента к тексту */
  color: transparent; 
`

const LogoTextSpan=styled.span`
  color: #fff;
`
export default Navbar