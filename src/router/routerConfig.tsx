import { createHashRouter, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout/MainLayout';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import MovieInfo from '../pages/MovieInfo/MovieInfo';
import MoviesList from '../pages/MoviesList/MoviesList';
import TVShowInfo from '../pages/TVShowInfo/TVShowInfo';
import TVShowsList from '../pages/TVShowsList/TVShowsList';

export const routerConfig = createHashRouter([
  {
    path: '',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={'/movies'} />,
      },
      {
        path: '/movies',
        element: <MoviesList />,
      },
      {
        path: '/movie_info',
        element: <MovieInfo />,
      },
      {
        path: '/tv_shows',
        element: <TVShowsList />,
      },
      {
        path: '/tv_show_info',
        element: <TVShowInfo />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);
