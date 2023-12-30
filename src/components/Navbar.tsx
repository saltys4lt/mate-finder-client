import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useAppDispatch, RootState } from '../redux'
import { changeLoginState, changeRegState } from '../redux/modalSlice'







const Navbar = () => {
  const dispatch=useAppDispatch()

    const user=useSelector((state:RootState)=>state.userReducer.user)
    const isAuth=useSelector((state:RootState)=>state.userReducer.isAuth)

  const openRegModal=() => {
    document.documentElement.style.overflowY='hidden'
    dispatch(changeRegState())
  }

  const openLoginModal=() => {
    document.documentElement.style.overflowY='hidden'
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
        {isAuth
          ?
          <AuthedNavbar>
          <NavLinks>
            <NavLink>Home</NavLink>
            <NavLink>Players</NavLink>
            <NavLink>Teams</NavLink>
            <NavLink>Other</NavLink>
            </NavLinks>
            <NavProfile>
            <NavNickname>{user?.nickname}</NavNickname>
            <NavAvatar src={user?.user_avatar}/>
            
          </NavProfile>
          <Exit src='/images/logout.png'/>  
            </AuthedNavbar>
          :<AuthButtons>
          <LoginButton onClick={openLoginModal}>login</LoginButton>
          <RegistrationButton onClick={openRegModal}>sign up</RegistrationButton>
          </AuthButtons>
        }
        
    </NavbarContainer>
  )
}



const NavbarContainer = styled.nav`

    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  font-size: 28px; 
  background: linear-gradient(45deg, #f33e3e, #949494);
  -webkit-background-clip: text; 
  color: transparent; 
`



const LogoTextSpan=styled.span`
  color: #fff;
`

const AuthedNavbar=styled.div`
  width: 70%;

  display: flex;
  justify-content: space-evenly;
  align-items: center;

`

const NavLinks=styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15%;
`

const NavLink=styled.div`
  color: #fff;
  font-size: 16px;
  cursor: pointer;
    transition: all .3s ease-in-out;
  &:after{
    content: ' ';
    display: block;
    width: 100%;
    height: 2px;
    background: linear-gradient(45deg, #f33e3e, #d84e17);
    opacity: 0;
    transition: opacity .2s ease-in-out;
  }
  &:hover{
    transform: scale(1.1);
    color: #ffdede;
  }
  &:hover::after{
    opacity: 1;
  }
`

const NavProfile=styled.div`

  display: flex;
  gap: 10px;
  align-items: center;
`

const NavNickname=styled.span`
  color: #fff;
`

const NavAvatar=styled.img`
width: 50px;
height: 50px;
background-color: #fff;
  border-radius: 50%;
`

const Exit=styled.img`
  height:40px;
  margin-left: 20px;
  cursor: pointer;
  transition: transform .2s ease-in-out;
  &:hover{
    transform: scale(1.1);
  }
`
export default Navbar