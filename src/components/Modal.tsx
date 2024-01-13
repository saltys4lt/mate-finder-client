import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RootState, useAppDispatch } from '../redux'
import { useSelector } from 'react-redux'
import { changeGameProfileState, changeLoginState, changeRegState } from '../redux/modalSlice'
import LoginForm from './AuthForms/LoginForm'
import RegistrationForm from './AuthForms/RegistrationForm'
import { LinearProgress } from '@mui/material'
import GameChoiceForm from './GameChoiceForm'

interface ModalStatus{
    $active:string
}



const Modal= () => {
const dispatch=useAppDispatch()
const regIsActive=useSelector((state:RootState)=>state.modalReducer.regIsActive)
const loginIsActive=useSelector((state:RootState)=>state.modalReducer.loginIsActive)
const gameChoiceIsActive=useSelector((state:RootState)=>state.modalReducer.gameChoiceIsActive)

const [isActive, setIsActive] = useState<string>('false')

useEffect(() => {
  if(regIsActive||loginIsActive||gameChoiceIsActive) setIsActive('true')
}, [regIsActive,loginIsActive,gameChoiceIsActive])


    const closeModal =() => {
      document.documentElement.style.overflowY='visible'
      setIsActive('false')
      setTimeout(() => {
        if(regIsActive) dispatch(changeRegState())
        if(loginIsActive) dispatch(changeLoginState())
        if(gameChoiceIsActive) dispatch(changeGameProfileState())

      }, 500);
     

    }

    const regStatus=useSelector((state:RootState)=>state.userReducer.createUserStatus)
    const loginStatus=useSelector((state:RootState)=>state.userReducer.fetchUserStatus)

    
    console.log(gameChoiceIsActive)
  
    

  return (
        <ModalContainer $active={isActive}  onClick={closeModal}>
        <Content $active={isActive} onClick={(e:React.MouseEvent)=>{e.stopPropagation()}}>
        <CloseCross src='/images/close-cross.png' onClick={closeModal}/>
        {(regStatus==='pending'||loginStatus==='pending')
        &&<>
         <LinearProgress color='inherit'  sx={{zIndex:3,height:'7px',borderRadius:'10px', position:'absolute', top:'2px',left:'50%',width:'100%',transform:'translate(-50%,-50%)' }} /> 
          <LoaderBackground/>
        </>

        }
       
        {loginIsActive&&
        <LoginForm/>
        }
        {regIsActive&& 
        <RegistrationForm/>
        }
        {gameChoiceIsActive&& 
        <GameChoiceForm/>
        }
       
        
        
        </Content>
    </ModalContainer>
  )
}

const ModalContainer=styled.div<ModalStatus>`
    height: 100vh;
    width: 100vw;
    background-color: rgba(0,0,0,0.4);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: ${p=>p.$active=='false'
    ?0
    :1
    };
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: ${p=>p.$active=='false'
    ?'none'
    :'all'
    };
    transition: opacity 0.4s ease-in-out;
   z-index: 2;
    
    
`

const Content=styled.div<ModalStatus>`
  overflow: hidden;
  position: relative;
    padding: 20px;
    border-radius: 12px;
    background-color: #e8e8e8;
    min-width: 200px;
    min-height: 200px;
    max-width: 450px;
    max-height: 600px;
    transition: all .3s ease-in-out;
    transform: ${p=>p.$active=='true'
    ?`translateY(0)`
    :`translateY(-150%)`
    };
    opacity: ${p=>p.$active=='true'
    ?1
    :0
    };
    position:relative;
`
const CloseCross=styled.img`
  padding-right: 10px;
  padding-top: 10px;
  display: block;
  width: 25px;
  height: 25px;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  transition: transform .2s ease-in-out ;
  &:hover{
    transform: scale(1.3);
  }
`
const LoaderBackground=styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #bababa; 
  opacity:0.7;
  inset: 0;
  margin: auto;
  border-radius: 12px;
  z-index: 2;
`

export default Modal