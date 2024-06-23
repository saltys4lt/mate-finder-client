import { useState, useEffect } from 'react';
import { fetchNews } from '../api/newsRequests/fetchNews';
import { Article } from '../types/Article';
import { MainArticle } from '../types/MainArticle';
import Container from '../components/Container';
import styled from 'styled-components';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
const NewsPage = () => {
  const [news, setNews] = useState<Article[] | null>(null);
  const [mainArticle, setMainArticle] = useState<MainArticle | null>(null);
  const [otherArticles, setOtherArticles] = useState<MainArticle[] | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      fetchNews({ setMainArticle, setNews, setOtherArticles });
    })();
  }, []);
  console.log(otherArticles);
  return (
    <Main>
      <Container>
        {news ? (
          <NewsSection>
            <h1>Последние новости</h1>
            <NewsMainContainer>
              <MainArticlesContainer onClick={() => navigate(`/news/${mainArticle?.link}`)}>
                <SubTitle>Самая популярная </SubTitle>
                <MainArticleContainer>
                  <ImageContainer>
                    <MainArticleImg src={mainArticle?.imgSrc} />
                    <GradientOverlay></GradientOverlay>
                    <TextOverlay>
                      <MainArticletTitle>{mainArticle?.title}</MainArticletTitle>
                      <MainArticletText>{mainArticle?.text}</MainArticletText>
                    </TextOverlay>
                  </ImageContainer>
                </MainArticleContainer>
                <SubTitle>Статьи </SubTitle>

                {otherArticles?.map((art) => (
                  <MainArticleContainer
                    key={art.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/news/${art?.link}`);
                    }}
                  >
                    <ImageContainer>
                      {' '}
                      <MainArticleImg src={art?.imgSrc} />
                      <GradientOverlay></GradientOverlay>
                      <TextOverlay>
                        <MainArticletTitle>{art?.title}</MainArticletTitle>

                        <MainArticletText>{art?.date}</MainArticletText>
                      </TextOverlay>
                    </ImageContainer>
                  </MainArticleContainer>
                ))}
              </MainArticlesContainer>
              <NewsContainer>
                {news.map((article) => (
                  <NewsItem key={article.newsId} onClick={() => navigate(`/news/${article?.link}`)}>
                    <span>{article.title}</span>
                  </NewsItem>
                ))}
              </NewsContainer>
            </NewsMainContainer>
          </NewsSection>
        ) : (
          <Loader />
        )}
      </Container>
    </Main>
  );
};

const Main = styled.main`
  flex: 1;
  color: var(--main-text-color);
  margin-block: 20px;
`;

const NewsSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const NewsMainContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  row-gap: 30px;
  background-color: #1f1f1f;
  padding-block: 20px;
`;

const MainArticlesContainer = styled.div`
  width: 48%;
  display: flex;
  flex-direction: column;
`;

const NewsContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  row-gap: 15px;
`;

const NewsItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-left: 2px solid #717171;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const SubTitle = styled.h4``;

const MainArticleContainer = styled.div`
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  border-radius: 5px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    opacity: 0.7;
    transform: translateX(10px);
  }
`;

const MainArticleImg = styled.img`
  width: 100%;
  max-width: 100%;
  border-radius: 5px;

  &::before {
    display: block;
    content: ' ';
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 5px;
    z-index: 1;
  }
`;

const GradientOverlay = styled.div`
  content: ' ';
  position: absolute;
  bottom: -15px;
  left: -30px;
  width: 120%;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.8));
  border-radius: 5px;
  z-index: 1;
  filter: blur(15px);
  pointer-events: none;
`;

const TextOverlay = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  bottom: 10px;
  left: 10px;
  z-index: 2;
  color: white;
  font-size: 1.2rem;
  padding: 3px;
`;

const MainArticletTitle = styled.a`
  font-weight: 700;
  > span {
    font-weight: 300;
  }
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const MainArticletText = styled.span`
  font-weight: 300;
  font-size: 15px;
`;
export default NewsPage;
