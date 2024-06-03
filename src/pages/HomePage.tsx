import styled from 'styled-components';
import Container from '../components/Container';
import Modal from '../components/Modal';
import { RootState, useAppDispatch } from '../redux';
import { changeGameProfileState } from '../redux/modalSlice';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNews } from '../api/newsRequests/fetchNews';
import { Article } from '../types/Article';
import { MainArticle } from '../types/MainArticle';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
const HomePage = () => {
  const user = useSelector((state: RootState) => state.userReducer.user);

  const dispatch = useAppDispatch();

  const [news, setNews] = useState<Article[] | null>(null);
  const [mainArticle, setMainArticle] = useState<MainArticle | null>(null);
  const [otherArticles, setOtherArticles] = useState<MainArticle[] | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      fetchNews({ setMainArticle, setNews, setOtherArticles });
    })();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflowY = 'visible';
    if (Cookies.get('_csData')) {
      const _csData = Cookies.get('_csData');
      if (_csData === 'exist') {
        Swal.fire({
          icon: 'warning',
          title: `Ошибочка`,
          text: `Такой аккаунт уже привязан`,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      if (_csData === 'noFaceit') {
        Swal.fire({
          icon: 'question',
          title: `Что-то не так`,
          text: `Похоже ваш steam аккаунт не привязан к faceit`,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
    Cookies.remove('_csData');
  }, []);
  const settings = {
    // Показать точки навигации
    infinite: true, // Зацикливание карусели
    speed: 10000, // Скорость анимации в миллисекундах
    slidesToShow: 1, // Показывать по одному слайду за раз
    slidesToScroll: 1, // Перемещаться на один слайд за раз
    autoplay: true, // Включить автопрокрутку
    autoplaySpeed: 4000, // Интервал автопрокрутки в миллисекундах (5 секунд)
    arrows: false,
    variableWidth: true,
  };
  return (
    <>
      <main>
        <MatchesBar>
          {news ? (
            <Slider {...settings} autoplaySpeed={0} cssEase='linear'>
              {news.map((art) => (
                <NewsItem
                  key={art.newsId}
                  onClick={() => {
                    navigate(`/news/${art.link}`);
                  }}
                >
                  <span>{art.title}</span>
                </NewsItem>
              ))}
            </Slider>
          ) : (
            <></>
          )}
        </MatchesBar>
        <Container>
          <MainContent>
            {user?.cs2_data ? <PlayerLiderBoard></PlayerLiderBoard> : <></>}
            <ContentNews>
              <NewsTitle>🔥 Самая свежая 🔥</NewsTitle>
              <MainArticleContainer>
                <ImageContainer
                  onClick={() => {
                    navigate(`/news/${mainArticle?.link}`);
                  }}
                >
                  <MainArticleImg src={mainArticle?.imgSrc} />
                  <GradientOverlay></GradientOverlay>
                  <TextOverlay>
                    <MainArticletTitle>{mainArticle?.title}</MainArticletTitle>
                    <MainArticletText>{mainArticle?.text}</MainArticletText>
                  </TextOverlay>
                </ImageContainer>
              </MainArticleContainer>
            </ContentNews>
          </MainContent>
        </Container>
      </main>
    </>
  );
};
const MainArticleContainer = styled.div`
  height: 100%;
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
const NewsTitle = styled.h3`
  color: var(--main-text-color);
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
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.9));
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
const MatchesBar = styled.div`
  width: 100%;

  background-color: #333;
`;

const MainContent = styled.section`
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: space-between;
  padding: 40px 0;
`;

const PlayerLiderBoard = styled.div`
  width: 48%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const ContentNews = styled.div`
  padding: 15px;
  padding-top: 5px;
  width: 48%;
  background-color: #1f1f1f;
  border-radius: 10px;
`;

const NewsItem = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  color: var(--main-text-color);

  border-left: 4px solid #717171;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  > span {
    white-space: nowrap;
    font-size: 19px;
  }
`;

export default HomePage;
