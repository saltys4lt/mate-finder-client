import { useState, useEffect } from 'react';

import { MainArticle } from '../types/MainArticle';

import styled from 'styled-components';
import Loader from '../components/Loader';
import { fetchArticleById } from '../api/newsRequests/fetchArticleById';
import { useParams } from 'react-router-dom';
const ArticlePage = () => {
  const params = useParams();
  const [mainArticle, setMainArticle] = useState<MainArticle | null>(null);
  useEffect(() => {
    (async () => {
      fetchArticleById({ setMainArticle, link: params.link as string });
    })();
  }, []);
  console.log(params);
  return (
    <Main>
      {mainArticle ? (
        <ArticleContainer>
          <Title>{mainArticle?.title}</Title>
          <SubTitle>{mainArticle?.subTitle}</SubTitle>
          <Image src={mainArticle?.imgSrc} alt={mainArticle?.title} />
          <Text dangerouslySetInnerHTML={{ __html: mainArticle?.text }} />
        </ArticleContainer>
      ) : (
        <Loader />
      )}
    </Main>
  );
};

const Main = styled.main`
  flex: 1;
  margin-block: 40px;
`;

const ArticleContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1d1d1d;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 10px;
  color: #ebebeb;
`;

const SubTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 20px;
  color: #c8c8c8;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Text = styled.div`
  font-size: 1em;
  line-height: 1.6;
  color: var(--main-text-color);

  p {
    margin-bottom: 1em;
  }
  a {
    color: var(--main-text-color);
  }
`;

export default ArticlePage;
