import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import MoviesList from "../pages/MoviesList/MoviesList";
import MovieInfo from "../pages/MovieInfo/MovieInfo";
import SearchPageMobile from "../pages/SearchPageMobile/SearchPageMobile";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

export const routerConfig = createBrowserRouter([
  {
    path: "/tmdb_deploy",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={"/tmdb_deploy/movies"} />,
      },
      {
        path: "/tmdb_deploy/movies",
        element: <MoviesList />,
      },
      {
        path: "/tmdb_deploy/movieInfo",
        element: <MovieInfo />,
      },
      {
        path: "/tmdb_deploy/search",
        element: <SearchPageMobile />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
