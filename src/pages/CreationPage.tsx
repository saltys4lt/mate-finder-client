import { RootState } from '../redux'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useRef } from 'react'
import { useEffect } from 'react'

const CreationPage = () => {
    const csgo_data=useSelector((state:RootState)=>state.userReducer.user?.csgo_data)
    const creationContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    if (creationContent.current) {
        creationContent.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  return (
    <CreationPageContainer  ref={creationContent}>
        <ContentBackground>
        <CreationPageContent>
        
            <LeftContent>
            <LvlImg src={csgo_data?.lvlImg} alt="" />
            <StatsText>ЕLO: <span>{csgo_data?.elo}</span></StatsText>
            <StatsText>Матчи: <span>{csgo_data?.matches}</span></StatsText>
            <StatsText>Победы: <span>{csgo_data?.wins}</span></StatsText>
            <StatsText>Винрейт: <span>{csgo_data?.winrate}</span>%</StatsText>
            <StatsText>Кд: <span>{csgo_data?.kd}</span></StatsText>
            <StatsText>Хс: <span>{csgo_data?.hs}</span>%</StatsText>
            
            <StatsText></StatsText>

            </LeftContent>
            
            <RightContent>

            </RightContent>
        </CreationPageContent>
        </ContentBackground>
    </CreationPageContainer>
  )
}

const CreationPageContainer=styled.div`
position: relative;
display: flex;
justify-content: center;
align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  &::before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/cs-creation-bg.webp');
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(10px);
     
  }
`

const ContentBackground=styled.div`
     position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  width: 80%;
  
  
    &::before{
        border-radius: 20px;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #333;
    opacity: 0.7;
        
  }
`
const CreationPageContent=styled.div`
z-index:1;
display: flex;
justify-content: space-between;
width: 100%;
`

const LeftContent=styled.div`
  
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 30px;
    padding: 20px;
   
`
const RightContent=styled.div`
    border-left: 1px solid #fff;
    width: 75%;
    padding: 20px;
`

const LvlImg=styled.img`
    width: 70px;
    display: block;
    background-color: #181818;
    padding: 3px;
    border-radius: 50%;
`

const StatsText=styled.p`
    color: #afafaf;
    font-size: 16px;

    span{
        font-size: 18px;
        color: #d6d6d6;
    }
`

export default CreationPage