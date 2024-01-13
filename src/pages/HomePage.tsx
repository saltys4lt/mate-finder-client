import React, { useEffect } from 'react'
import Container from '../components/Container'
import styled from 'styled-components'
import { useAppDispatch } from '../redux'
import { changeGameProfileState} from '../redux/modalSlice'
import Modal from '../components/Modal'

const HomePage = () => {
  document.documentElement.style.overflowY='visible'
  const dispatch = useAppDispatch()
  const openGameProfileModal=() => {
    dispatch(changeGameProfileState())
  }

  
  

  return (
    <>
    
    <main>
      <MatchesBar/>
      <Container>
        <MainContent>
        <Modal/>
          <ContentButtons>
            <ContentLink>Find Players </ContentLink>
            <ContentLink>Find Your Team</ContentLink>
            <GameProfileButton onClick={openGameProfileModal}>Create Game Profile</GameProfileButton>
          </ContentButtons>
          <ContentNews>
          </ContentNews>
        </MainContent>
      </Container>
    </main>
    </>
    
  )
}

const MatchesBar=styled.div`
  width: 100%;
  height: 100px;
  background-color: #333;
`

const MainContent=styled.section`
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: space-between;
  padding: 40px 0;
`

const ContentButtons=styled.div`
width: 48%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`
const ContentNews=styled.div`
  width: 48%;
  background-color: #575757;
`
const ContentLink=styled.div`
display: flex;
justify-content: center;
align-items: center;

  height: 70px;
  font-weight: 400;
  font-size: 18px;
  font-family: montserrat;
  text-transform: uppercase;
  color: #fff;
  padding: 5px 16px;
  border-radius: 4px;
  background: radial-gradient(
    circle at 20% 100%,
    rgb(145, 43, 36) 30%,
    rgb(224, 6, 6) 200%
  );

  background-size: 100%;
  text-align: center;

  width: 300px;
  border: 1px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    background-size: 150%;
  }
`
const GameProfileButton=styled.div`
display: flex;
justify-content: center;
align-items: center;

  height: 70px;
  font-weight: 400;
  font-size: 18px;
  font-family: montserrat;
  text-transform: uppercase;
  color: #fff;
  padding: 5px 16px;
  border-radius: 4px;
  background: radial-gradient(
    circle at 10% 100%,
    rgb(177, 139, 16)30%,
    rgb(0, 0, 0) 200%
  );

  background-size: 100%;
  text-align: center;

  width: 300px;
  border: 1px solid #000000;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
    background-size: 150%;
  }
`




export default HomePage