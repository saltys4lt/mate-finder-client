import axios from 'axios';
import { Article } from '../../types/Article';
import { MainArticle } from '../../types/MainArticle';
const baseUrl = import.meta.env.VITE_BASE_URL;

interface params {
  setNews: (news: Article[]) => void;
  setMainArticle: (mainArticle: MainArticle) => void;
  setOtherArticles: (аrticles: MainArticle[]) => void;
}

export const fetchNews = async ({ setMainArticle, setNews, setOtherArticles }: params) => {
  const { data } = await axios.get<{ news: Article[]; mainArticle: MainArticle; otherArticles: MainArticle[] }>(`${baseUrl}/news`, {
    withCredentials: true,
  });
  if (data) {
    setNews(data.news);
    setMainArticle(data.mainArticle);
    setOtherArticles(data.otherArticles);
  }
};
