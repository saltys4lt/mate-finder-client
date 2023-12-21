import React from 'react'
import { FC } from 'react'
import styled from 'styled-components'

interface ContainerProps{
    children:React.ReactNode
}

const MainContainer=styled.div`
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 10px;
`

const Container:FC<ContainerProps> = ({children}) => {
  return (
    <MainContainer>
      {children}
    </MainContainer>
  )
}

export default Container