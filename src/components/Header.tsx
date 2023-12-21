import React from 'react'
import styled from 'styled-components'
import Navbar from './Navbar'

const HeaderContainer=styled.header`
  
    width: 100%;
    height: 90px;
    padding: 13px 0;
    background-color: #202020;
    color: #fff;
  display: flex;
  align-items: center;
`


const Header = () => {
  return (
    <HeaderContainer>
      <Navbar/>
    </HeaderContainer>
  )
}

export default Header