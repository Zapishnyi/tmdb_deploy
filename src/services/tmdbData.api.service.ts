import axios from "axios";
import {tmdbDataURLS} from "../constants/tmdbURLS";
import IMoviesPaginated from "../models/IMoviesPaginated";
import IGenres from "../models/IGenres";
import ITVShowsPaginated from "../models/ITVShowsPaginated";

const axiosInstance = axios.create({
    baseURL: tmdbDataURLS.base,
    headers: {
        "Content-Type": "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjdiODE5MGYyY2E1ODE0M2JlMThjZTY1Y2UyNGNlNSIsInN1YiI6IjY0NDdhNzU2MDI1NzY0MDRkMDI3NjE0NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JuF-6Mp8a7Tcu2fWrq3pL1R7NnwUdzpHQ1uuynCgLpw",
    },
});

interface ITmdbDataApiService {
    getMovieGenres: Promise<IGenres>;
    getTVShowGenres: Promise<IGenres>;
    getMovies: (getQuery: string) => Promise<IMoviesPaginated>;
    searchMovies: (searchQuery: string) => Promise<IMoviesPaginated>;
    getTVShows: (getQuery: string) => Promise<ITVShowsPaginated>;
    searchTVShows: (searchQuery: string) => Promise<ITVShowsPaginated>;
}

export const tmbdDataService: ITmdbDataApiService = {

    getMovieGenres: axiosInstance
        .get(tmdbDataURLS.MovieGenres)
        .then((response) => response.data),

    getTVShowGenres: axiosInstance
        .get(tmdbDataURLS.TVShowsGenres)
        .then((response) => response.data),

    getMovies: (getQuery) =>
        axiosInstance
            .get(tmdbDataURLS.allMovies(getQuery))
            .then((value) => value.data),

    searchMovies: (searchQuery) =>
        axiosInstance
            .get(tmdbDataURLS.searchMovies(searchQuery))
            .then((value) => value.data),

    getTVShows: (getQuery) =>
        axiosInstance
            .get(tmdbDataURLS.allTVShows(getQuery))
            .then((value) => value.data),

    searchTVShows: (searchQuery) =>
        axiosInstance
            .get(tmdbDataURLS.searchTVShows(searchQuery))
            .then((value) => value.data),
};

// const subscribeToWaitList = (cb: IWaitList) => {
