import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { moviesFiltering } from '../../helpers/MovieFilter';
import IErrorResponse from '../../models/IErrorResponse';
import IMovie from '../../models/IMovie';
import IMoviesPaginated from '../../models/IMoviesPaginated';
import { get } from '../../services/getTMDBData.api.service';
import { RootState } from '../store';

import { PaginationMovieAction } from './paginationMovieSlice';

interface IMoviesSlice {
  query: string;
  moviesDownloaded: IMovie[];
  moviesFiltered: IMovie[];
  chosenMovie: IMovie | null;
  genresIds: number[];
  loadingStateMovies: boolean;
}

interface ISearchQuery {
  searchByTitle: boolean;
  query: string;
}

const initialState: IMoviesSlice = {
  query: '',
  moviesDownloaded: [],
  genresIds: [],
  moviesFiltered: [],
  chosenMovie: null,
  loadingStateMovies: false,
};

const moviesDownload = async (
  { query, searchByTitle }: ISearchQuery,
  movies: IMoviesPaginated,
): Promise<IMoviesPaginated> => {
  const moviesRecursion = async (
    query: string,
    searchByTitle: boolean,
    movies: IMoviesPaginated,
  ): Promise<IMoviesPaginated> => {
    const tempMovies = await get.movie.byTitle(query);
    movies = { ...tempMovies, results: [...(movies.results || []), ...(tempMovies.results || [])] };
    if (tempMovies.total_pages !== tempMovies.page && tempMovies.page <= 29) {
      movies = await moviesRecursion(query.replace(/(?<=page=)\d*/, (++tempMovies.page).toString()), searchByTitle, {
        ...movies,
      });
    }
    return movies;
  };
  const moviesFound = await moviesRecursion(query, searchByTitle, movies);
  if (moviesFound.page === 30) {
    moviesFound.total_pages = 30;
    moviesFound.total_results = 600;
  }

  return moviesFound;
};

const searchMovies = createAsyncThunk('movies/searchMovies', async (searchQuery: ISearchQuery, thunkAPI) => {
  try {
    // thunkAPI.dispatch(MoviesActions.clearMoviesDownloaded());
    const state = thunkAPI.getState() as RootState;
    let moviesDownloaded: IMoviesPaginated;
    if (searchQuery.searchByTitle) {
      if (state.Movies.query === searchQuery.query && state.Movies.genresIds === state.Search.chosenGenresMoviesId) {
        return thunkAPI.fulfillWithValue({ results: [] });
      }
      thunkAPI.dispatch(PaginationMovieAction.resetScrollPosition());
      thunkAPI.dispatch(MoviesActions.clearMoviesDownloaded());
      thunkAPI.dispatch(MoviesActions.clearMoviesFiltered());
      thunkAPI.dispatch(PaginationMovieAction.resetScrollPosition());
      thunkAPI.dispatch(PaginationMovieAction.setPage(1));

      const movies: IMoviesPaginated = { page: 1, total_pages: 1, total_results: 0 };
      moviesDownloaded = await moviesDownload(searchQuery, movies);
      const moviesFiltered = moviesFiltering(moviesDownloaded.results || []);
      thunkAPI.dispatch(MoviesActions.setMoviesFiltered(moviesFiltered.results));
      thunkAPI.dispatch(PaginationMovieAction.setPaginationFiltered(moviesFiltered));
    } else {
      if (state.Movies.query === searchQuery.query) {
        return thunkAPI.fulfillWithValue({ results: [] });
      } else {
        if (
          state.Movies.query.includes('query=') ||
          !state.Movies.query.includes(`language=${state.Language.language}`) ||
          ((state.Movies.query.match(/(?<=with_genres=)[^&]+/g) || [])[0] || 'void') !==
            (state.Search.chosenGenresMoviesId.join(',') || 'void')
        ) {
          thunkAPI.dispatch(MoviesActions.clearMoviesDownloaded());
          thunkAPI.dispatch(MoviesActions.clearMoviesFiltered());
          thunkAPI.dispatch(PaginationMovieAction.resetScrollPosition());
          thunkAPI.dispatch(PaginationMovieAction.setPage(1));
          searchQuery.query = `?page=1&with_genres=${state.Search.chosenGenresMoviesId.join(',')}&language=${state.Language.language}`;
        }
        moviesDownloaded = await get.movie.byGenres(searchQuery.query);
      }
      const updatedState = thunkAPI.getState() as RootState;
      thunkAPI.dispatch(
        MoviesActions.setMoviesFiltered([...updatedState.Movies.moviesDownloaded, ...(moviesDownloaded.results || [])]),
      );
      thunkAPI.dispatch(PaginationMovieAction.setPaginationFiltered(moviesDownloaded));
    }
    thunkAPI.dispatch(MoviesActions.setQuery(searchQuery.query));
    thunkAPI.dispatch(MoviesActions.setGenresIds(state.Search.chosenGenresMoviesId));
    return thunkAPI.fulfillWithValue(moviesDownloaded);
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(MoviesActions.setLoadingState(false));
  }
});

export const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setChosenMovie: (state, action) => {
      state.chosenMovie = action.payload;
    },
    setLoadingState: (state, action) => {
      state.loadingStateMovies = action.payload;
    },
    setMoviesFiltered: (state, action) => {
      state.moviesFiltered = action.payload;
    },
    clearMoviesDownloaded: (state) => {
      state.moviesDownloaded = [];
    },
    clearMoviesFiltered: (state) => {
      state.moviesFiltered = [];
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setGenresIds: (state, action) => {
      state.genresIds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.moviesDownloaded = [...state.moviesDownloaded, ...(action.payload.results || [])];
      })
      .addMatcher(isRejected(searchMovies), (state, action) => {
        console.log('Movies receive sequence failed with error:', action.payload);
      })
      .addMatcher(isPending(searchMovies), (state) => {
        state.loadingStateMovies = true;
      });
  },
});

export const MoviesActions = {
  ...moviesSlice.actions,
  searchMovies,
};
