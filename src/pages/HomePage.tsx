import styled from 'styled-components';
import Container from '../components/Container';
import { RootState } from '../redux';
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
import steamIcon from '../assets/images/steam-logo.png';
import faceitLogo from '../assets/images/faceitlogo.png';
import { SteamAuth } from '../api/steamAuth';
import TopPlayersList from '../components/TopPlayersList';
import Skeleton from '../components/Skeleton/ResponsiveSkeleton';

const HomePage = () => {
  const user = useSelector((state: RootState) => state.userReducer.user);

  const [news, setNews] = useState<Article[] | null>(null);
  const [mainArticle, setMainArticle] = useState<MainArticle | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      fetchNews({ setMainArticle, setNews });
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
    infinite: true,
    speed: 10000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
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
            {user?.cs2_data ? (
              <PlayerLiderBoard>
                <TopPlayersList id={user.id} />
              </PlayerLiderBoard>
            ) : (
              <SteamAuthContainer>
                <SteamButton onClick={SteamAuth}>
                  <span>
                    Подключить<span>Steam</span>
                  </span>

                  <img src={steamIcon} alt='' />
                </SteamButton>
                <SteamText>
                  Подключение вашего аккаунта Steam позволит нам взять ваши настоящие данные Counter-Strike . Таким образом статистика
                  игроков не может оказаться подлинной.{' '}
                </SteamText>
                <SteamText>
                  Ваш steam аккаунт обязательно должен быть привязан к платформе &nbsp;
                  <span>
                    Faceit <img src={faceitLogo} alt='' />
                  </span>{' '}
                </SteamText>
              </SteamAuthContainer>
            )}
            <ContentNews>
              {mainArticle ? (
                <>
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
                </>
              ) : (
                <Skeleton style={{ borderRadius: '5px' }} />
              )}
            </ContentNews>
          </MainContent>
        </Container>
      </main>
    </>
  );
};

const SteamAuthContainer = styled.div`
  width: 40%;
  display: flex;

  flex-direction: column;
  row-gap: 20px;
  background-color: #1f1f1f;
  border-radius: 10px;
`;

const SteamText = styled.p`
  font-size: 17px;
  padding: 5px;
  border-bottom: 1px solid #242424;
  color: var(--main-text-color);
  > span {
    column-gap: 10px;
    font-weight: 700;
    color: var(--orange-color);
    display: inline-flex;

    > img {
      border-radius: 5px;
      max-width: 20px;
    }
  }
`;

const SteamButton = styled.button`
  border: 0;
  height: 80px;
  border-radius: 5px;

  background-color: #323232;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  padding: 5px;
  font-size: 19px;
  border: 3px solid #3e3e3e;
  color: var(--main-text-color);
  img {
    width: 70px;
  }
  &:hover {
    background-color: #1d1d1d;
    cursor: pointer;
  }
  > span {
    > span {
      margin-left: 5px;
      font-size: 19px;
      font-weight: 700;
    }
  }
`;
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
  left: -30px;

  width: 120%;
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
