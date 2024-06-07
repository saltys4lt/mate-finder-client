import { lazy, Suspense } from 'react';
import StartPage from '../pages/StartPage';
import Loader from '../components/Loader';
import PlayersPage from '../pages/PlayersPage';
import FriendsPage from '../pages/FriendsPage';
import TeamCreationPage from '../pages/TeamCreationPage';
import TeamsPage from '../pages/TeamsPage';

import NewsPage from '../pages/NewsPage';
import { Navigate } from 'react-router-dom';
import TeamPage from '../pages/TeamPage';
import NotFoundPage from '../pages/NotFoundPage';
import ArticlePage from '../pages/ArticlePage';
import SquadLinkDescription from '../pages/AboutPage';
const HomePage = lazy(() => import('../pages/HomePage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

export const authorizedGameProfileRoutes = [
  { path: '/players', element: <PlayersPage /> },
  {
    path: '/friends',
    element: (
      <Suspense fallback={<Loader />}>
        <FriendsPage />
      </Suspense>
    ),
  },
  {
    path: '/team-creator/:name?',
    element: (
      <Suspense fallback={<Loader />}>
        <TeamCreationPage />
      </Suspense>
    ),
  },
  {
    path: '/team/:name',
    element: (
      <Suspense fallback={<Loader />}>
        <TeamPage />
      </Suspense>
    ),
  },
  {
    path: '/teams',
    element: (
      <Suspense fallback={<Loader />}>
        <TeamsPage />
      </Suspense>
    ),
  },
  { path: '/news/:link', element: <ArticlePage /> },

  { path: '*', element: <Navigate to='/404' replace={true} /> },
];

export const privateRoutes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<Loader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: <SquadLinkDescription />,
  },
  {
    path: '/news',
    element: (
      <Suspense fallback={<Loader />}>
        <NewsPage />
      </Suspense>
    ),
  },
  { path: '/news/:link', element: <ArticlePage /> },
  {
    path: '/profile/:nickname',
    element: (
      <Suspense fallback={<Loader />}>
        <ProfilePage />
      </Suspense>
    ),
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '/about',
    element: <SquadLinkDescription />,
  },
  { path: '*', element: <Navigate to='/404' replace={true} /> },
];

export const publicRoutes = [
  { path: '/', element: <StartPage /> },
  { path: '/news', element: <NewsPage /> },
  { path: '/news/:link', element: <ArticlePage /> },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '/about',
    element: <SquadLinkDescription />,
  },
  { path: '*', element: <Navigate to='/404' /> },
];
