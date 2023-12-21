import React, { FC } from 'react'
import styled from 'styled-components'
import { RootState, useAppDispatch } from '../redux'
import { useSelector } from 'react-redux'
import { changeLoginState, changeRegState } from '../redux/modalSlice'





const Modal= () => {
const dispatch=useAppDispatch()
const regIsActive=useSelector((state:RootState)=>state.modalReducer.regIsActive)
const loginIsActive=useSelector((state:RootState)=>state.modalReducer.loginIsActive)


    const closeModal =() => {
      if(regIsActive) dispatch(changeRegState())
      if(loginIsActive) dispatch(changeLoginState())

    }

  return (
    // regIsActive||loginIsActive
    //     ?   <ModalContainer onClick={closeModal}>
    //     <Content onClick={(e:React.MouseEvent)=>{e.stopPropagation()}}>   
    //     {loginIsActive&&<div>
    //         login
    //     </div>
        
    //     }
    //     {regIsActive&&<div>
    //         registration
    //     </div>

    //     }
    //     </Content>
    // </ModalContainer>
    //     :<></>

        <ModalContainer active={(loginIsActive||regIsActive).toString()}  onClick={closeModal}>
        <Content active={(loginIsActive||regIsActive).toString()} onClick={(e:React.MouseEvent)=>{e.stopPropagation()}}>   
        {loginIsActive&&<div>
            login
        </div>
        
        }
        {regIsActive&&<div>
            registration
        </div>

        }
        </Content>
    </ModalContainer>
  )
}

interface ModalStatus{
    active:string
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
    opacity: ${p=>p.active=='false'
    ?0
    :1
    };
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: ${p=>p.active=='false'
    ?'none'
    :'all'
    };
    transition: opacity 0.4s ease-in-out;
   
    
    
`

const Content=styled.div<ModalStatus>`
    padding: 20px;
    border-radius: 12px;
    background-color: wheat;
    width: 200px;
    height: 200px;
    transition: all .2s ease-in-out;
    transform: ${p=>p.active=='true'
    ?`translateY(0)`
    :`translateY(-200%)`
    };
    opacity: ${p=>p.active=='true'
    ?1
    :0
    };
`

export default Modal