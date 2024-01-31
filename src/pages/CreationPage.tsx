import { RootState } from "../redux";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useRef } from "react";
import { useEffect } from "react";

const CreationPage = () => {
  const [roles, setRoles] = useState<string[]>([])
  const rolesArray=['Рифлер','Снайпер','Люркер','Саппорт','Энтри','Капитан']
  const changeRole = (e:React.ChangeEvent<HTMLInputElement>) => {
    
    if(!roles.includes(e.target.value)) setRoles([...roles,e.target.value] )
    else setRoles( roles.filter(role=>role!==e.target.value))

  }
 console.log(roles)
  const csgo_data = useSelector(
    (state: RootState) => state.userReducer.user?.csgo_data
  );
  const creationContent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (creationContent.current) {
      creationContent.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);


  const roleState = (role:string) => {
    if(roles.includes(role)) return 'active'
    if(roles.length===3&&!roles.includes(role)) return 'focus'
    else return ''
  }
  return (
    <CreationPageContainer ref={creationContent}>
      <ContentBackground>
        <CreationPageContent>
          <LeftContent>
            <ContentTitle>Ваша статистика</ContentTitle>
            <LvlImg src={csgo_data?.lvlImg} alt="" />
            <StatsText>
              ЕLO: <span>{csgo_data?.elo}</span>
            </StatsText>
            <StatsText>
              Матчи: <span>{csgo_data?.matches}</span>
            </StatsText>
            <StatsText>
              Победы: <span>{csgo_data?.wins}</span>
            </StatsText>
            <StatsText>
              Винрейт: <span>{csgo_data?.winrate}</span>%
            </StatsText>
            <StatsText>
              Кд: <span>{csgo_data?.kd}</span>
            </StatsText>
            <StatsText>
              Хс: <span>{csgo_data?.hs}</span>%
            </StatsText>
          </LeftContent>

          <RightContent>
            <ContentTitle>На какой роли/ролях вы обычно играете ?</ContentTitle>
            <ContentSubtitle>
              Выберите 1-3 роли. Они будут отображены в вашем игровом профиле
            </ContentSubtitle>
            
            <RolesContainer>
            {rolesArray.map((role,index)=>
           <RoleCard key={role}>
            <RoleCheckbox
                  id={(index+1).toString()}
                  type="checkbox"
                  onChange={(e) => changeRole(e)}
                  value={role}
                 disabled={roleState(role)==='focus'}
                />
                <RoleLabel  className={roleState(role)}  htmlFor={(index+1).toString()}>{role}</RoleLabel>
           </RoleCard>)

           }
            </RolesContainer>
          
          </RightContent>
        </CreationPageContent>
      </ContentBackground>
    </CreationPageContainer>
  );
};

const CreationPageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("/images/cs-creation-bg.webp");
    background-size: cover;
    background-repeat: no-repeat;
    filter: blur(10px);
  }
`;

const ContentBackground = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  width: 55%;
  @media (max-width:1050px) {
    min-width: 550px;
  }
  &::before {
    border-radius: 20px;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #333;
    opacity: 0.9;
  }
`;
const CreationPageContent = styled.div`
  z-index: 1;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 30px;
  padding: 20px;
`;

const LvlImg = styled.img`
  width: 70px;
  display: block;
  background-color: #181818;
  padding: 3px;
  border-radius: 50%;
`;

const StatsText = styled.p`
  color: #afafaf;
  font-size: 16px;

  span {
    font-size: 18px;
    color: #d6d6d6;
  }
`;

const RightContent = styled.div`
  width: 77%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #fff;
`;

const ContentTitle = styled.h2`
  color: #d6d6d6;
  font-size: 20px;
  text-align: center;
`;

const ContentSubtitle = styled.p`
  color: #9e9e9e;
  font-size: 13px;
  text-align: center;
  margin-top: 10px;
`;
const RolesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
 margin-top: 20px;
 flex-wrap: wrap;
`;

const RoleCard=styled.div`
    margin-top: 15px;
   flex: 1 0 calc(33.33% - 10px);
   display: flex;
   justify-content: center;
`

const RoleCheckbox = styled.input`
  display: none;
`;


const RoleLabel = styled.label`

border: 2px solid #565656;
  background-color: #181818;
  padding: 5px 10px;
  border-radius: 7px;
  display: block;
  width: 130px;
  text-align: center;
  font-size: 16px;
  color: #d1cfcf; 
  &:hover{
    border-color: #fff;
    cursor: pointer;
  }

  &.active{
    border-color: #fff;
    transform: scale(1.03);
  }

  &.focus{
    opacity: 0.3;
    border: 2px solid #565656;
    &:hover{
    cursor: auto;
  }
  }
  
 
  
user-select: none;
  &:hover{
    cursor: pointer;
  }
`;

export default CreationPage;
