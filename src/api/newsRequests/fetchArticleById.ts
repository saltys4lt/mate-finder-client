import axios from 'axios';

import { MainArticle } from '../../types/MainArticle';
const baseUrl = import.meta.env.VITE_BASE_URL;

interface params {
  setMainArticle: (mainArticle: MainArticle) => void;
  link: string;
}

export const fetchArticleById = async ({ setMainArticle, link }: params) => {
  console.log(link);
  const { data } = await axios.get<MainArticle>(`${baseUrl}/news/${link}`, {
    withCredentials: true,
  });
  if (data) {
    console.log(data);
    setMainArticle(data);
  }
};
