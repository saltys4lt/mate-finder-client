import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background-color: #2d2d2d;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #ecf0f1;
`;

const Title = styled.h1`
  text-align: center;
  color: #ecf0f1;
  margin-block: 15px;
`;

const Subtitle = styled.h2`
  color: var(--orange-color);
  margin-top: 20px;
`;

const Text = styled.p`
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const List = styled.ul`
  color: #bdc3c7;
  line-height: 1.6;
  padding-left: 20px;
  list-style: circle;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

export const SquadLinkDescription: React.FC = () => {
  return (
    <Container>
      <Title>SquadLink</Title>
      <Text>
        <strong>Система подбора игроков "SquadLink" </strong> — это современное веб-приложение, разработанное для поиска игроков и
        формирования команд в Counter-Strike. Пользователи могут создавать свои собственные команды, приглашать в них новых игроков или
        присоединяться к уже существующим командам.
      </Text>

      <Subtitle>Проблема</Subtitle>
      <Text>
        В последние годы соревновательные онлайн-игры стали важной частью мира компьютерных технологий. Однако, с ростом популярности таких
        игр появилась проблема для соло-игроков — чувство изолированности и отсутствие командной работы. Многие одиночные игроки
        сталкиваются с трудностями в общении с командой, не могут наладить взаимодействие, что приводит к частым поражениям.
      </Text>
      <Text>
        В связи с этим возникает вопрос: стоит ли начинать играть, если это приносит не радость, а разочарование? Тема соло-гейминга сегодня
        особенно актуальна, поскольку множество подростков увлекаются соревновательными онлайн-играми, часто связанными с киберспортом. Они
        стремятся улучшить свои навыки, но не достигают желаемых результатов, обвиняя в этом команду.
      </Text>
      <Text>
        <strong>SquadLink</strong> решает эту проблему, предлагая платформу, где одиночные игроки могут легко находить подходящих партнеров
        по команде, улучшать взаимодействие и усиливать свои игровые навыки. Это помогает создать более сбалансированные и успешные команды,
        что приводит к большему удовлетворению от игры.
      </Text>

      <Subtitle>Цели и задачи</Subtitle>
      <Text>Основная цель приложения включает решение следующих задач:</Text>
      <List>
        <ListItem>Поиск и подбор игроков</ListItem>
        <ListItem>Создание собственной команды</ListItem>
        <ListItem>Присоединение к существующим командам</ListItem>
        <ListItem>Создание игрового профиля</ListItem>
        <ListItem>Просмотр новостей киберспорта</ListItem>
        <ListItem>Просмотр результатов матчей</ListItem>
      </List>
    </Container>
  );
};

export default SquadLinkDescription;
