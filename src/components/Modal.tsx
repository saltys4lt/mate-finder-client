import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { RootState, useAppDispatch } from '../redux'
import { useSelector } from 'react-redux'
import { changeLoginState, changeRegState } from '../redux/modalSlice'
import LoginForm from './AuthForms/LoginForm'
import RegistrationForm from './AuthForms/RegistrationForm'
import { LinearProgress } from '@mui/material'

interface ModalStatus{
    $active:string
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

const Modal= () => {
const dispatch=useAppDispatch()
const regIsActive=useSelector((state:RootState)=>state.modalReducer.regIsActive)
const loginIsActive=useSelector((state:RootState)=>state.modalReducer.loginIsActive)

const [isActive, setIsActive] = useState<string>('false')

useEffect(() => {
  if(regIsActive||loginIsActive) setIsActive('true')
}, [regIsActive,loginIsActive])


    const closeModal =() => {
      document.documentElement.style.overflowY='visible'


      setIsActive('false')
      setTimeout(() => {
        if(regIsActive) dispatch(changeRegState())
        if(loginIsActive) dispatch(changeLoginState())
      }, 500);
     

    }

    const regStatus=useSelector((state:RootState)=>state.userReducer.createUserStatus)
    const loginStatus=useSelector((state:RootState)=>state.userReducer.fetchUserStatus)

    const regError=useSelector((state:RootState)=>state.userReducer.createUserError)
    const loginError=useSelector((state:RootState)=>state.userReducer.fetchUserError)

  
    

  return (
        <ModalContainer $active={isActive}  onClick={closeModal}>
        <Content $active={isActive} onClick={(e:React.MouseEvent)=>{e.stopPropagation()}}>
        {(regStatus==='pending'||loginStatus==='pending')
        &&<>
         <LinearProgress color='inherit'   sx={{zIndex:3,height:'7px',borderRadius:'10px', position:'absolute', top:'2px',left:'50%',width:'100%',transform:'translate(-50%,-50%)' }} /> 
          <LoaderBackground/>
        </>

        }
       
        {loginIsActive&&
        <LoginForm/>
        }
        {regIsActive&& 
        <RegistrationForm/>
        }
       
        
        
        </Content>
    </ModalContainer>
  )
}



export default Modal