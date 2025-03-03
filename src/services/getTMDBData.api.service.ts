import axios from 'axios';

import { url, urlBase } from '../constants/tmdbURLS';
import { ICredits } from '../models/ICredits';
import IGenres from '../models/IGenres';
import IImages from '../models/IImages';
import IMovieDetails from '../models/IMovieDetails';
import IMoviesPaginated from '../models/IMoviesPaginated';
import ITVShowDetails from '../models/ITVShowDetails';
import ITVShowsPaginated from '../models/ITVShowsPaginated';

const axiosInstance = axios.create({
  baseURL: urlBase,
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjdiODE5MGYyY2E1ODE0M2JlMThjZTY1Y2UyNGNlNSIsInN1YiI6IjY0NDdhNzU2MDI1NzY0MDRkMDI3NjE0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JuF-6Mp8a7Tcu2fWrq3pL1R7NnwUdzpHQ1uuynCgLpw',
  },
});

interface ITmdbDataApiService {
  movie: {
    genres: Promise<IGenres>;
    byGenres: (query: string) => Promise<IMoviesPaginated>;
    byTitle: (query: string) => Promise<IMoviesPaginated>;
    byId: (id: number, language: string) => Promise<IMovieDetails>;
    credits: (id: number, language: string) => Promise<ICredits>;
    images: (id: number, language: string) => Promise<IImages>;
  };
  tvShow: {
    genres: Promise<IGenres>;
    byGenres: (query: string) => Promise<ITVShowsPaginated>;
    byTitle: (query: string) => Promise<ITVShowsPaginated>;
    byId: (id: number, query: string) => Promise<ITVShowDetails>;
    season: (show_id: number, season_no: number) => Promise<IMovieDetails>;
  };
}

export const get: ITmdbDataApiService = {
  movie: {
    genres: axiosInstance.get(url.movie.genres).then((response) => response.data),
    byGenres: (query) => axiosInstance.get(url.movie.allByGenres(query)).then((value) => value.data),
    byTitle: (query) => axiosInstance.get(url.movie.allByTitle(query)).then((value) => value.data),
    byId: (id, language) => axiosInstance.get(url.movie.oneById(id, language)).then((value) => value.data),
    credits: (id, language) => axiosInstance.get(url.movie.credits(id, language)).then((value) => value.data),
    images: (id, language) => axiosInstance.get(url.movie.images(id, language)).then((value) => value.data),
  },
  tvShow: {
    genres: axiosInstance.get(url.tvShow.genres).then((response) => response.data),
    byGenres: (query) => axiosInstance.get(url.tvShow.allByGenres(query)).then((value) => value.data),

    byTitle: (query) => axiosInstance.get(url.tvShow.allByTitle(query)).then((value) => value.data),
    byId: (id, query) => axiosInstance.get(url.tvShow.oneById(id, query)).then((value) => value.data),
    season: (show_id, season_no) =>
      axiosInstance.get(url.tvShow.season(show_id, season_no)).then((value) => value.data),
  },
};
