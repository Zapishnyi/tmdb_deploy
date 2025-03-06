import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import IErrorResponse from '../../models/IErrorResponse';
import IGenre from '../../models/IGenre';
import { get } from '../../services/getTMDBData.api.service';
import { RootState } from '../store';

interface IGenresSlice {
  searchNameMovie: string;
  searchNameTVShow: string;
  genresTVShows: IGenre[];
  genresMovies: IGenre[];
  chosenGenresMoviesId: number[];
  chosenGenresTVShowsId: number[];
  loadingStateGenres: boolean;
}

const initialState: IGenresSlice = {
  searchNameMovie: '',
  searchNameTVShow: '',
  genresTVShows: [],
  genresMovies: [],
  chosenGenresMoviesId: [],
  chosenGenresTVShowsId: [],
  loadingStateGenres: false,
};

const loadMovieGenres = createAsyncThunk('genres/loadMovieGenres', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    const genres = await get.movie.genres(state.Language.language).then(({ genres }) => genres);
    return thunkAPI.fulfillWithValue(genres);
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(SearchActions.setLoadingState(false));
  }
});

const loadTVShowsGenres = createAsyncThunk('genres/loadTVShowGenres', async (_, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    const genres = await get.tvShow.genres(state.Language.language).then(({ genres }) => genres);
    return thunkAPI.fulfillWithValue(genres);
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(SearchActions.setLoadingState(false));
  }
});

export const searchSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {
    setChosenGenresMoviesId: (state, action) => {
      state.chosenGenresMoviesId = action.payload;
    },
    setChosenGenresTVShowsId: (state, action) => {
      state.chosenGenresTVShowsId = action.payload;
    },
    setMovieSearchName: (state, action) => {
      state.searchNameMovie = action.payload;
    },
    setTVShowSearchName: (state, action) => {
      state.searchNameTVShow = action.payload;
    },
    setLoadingState: (state, action) => {
      state.loadingStateGenres = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMovieGenres.fulfilled, (state, action) => {
        state.genresMovies = action.payload;
      })
      .addCase(loadTVShowsGenres.fulfilled, (state, action) => {
        state.genresTVShows = action.payload;
      })
      .addMatcher(isRejected(loadMovieGenres, loadTVShowsGenres), (state, action) => {
        console.log('Genres receive sequence failed with error:', action.payload);
      })
      .addMatcher(isPending(loadMovieGenres, loadTVShowsGenres), (state) => {
        state.loadingStateGenres = true;
      });
  },
});

export const SearchActions = { ...searchSlice.actions, loadMovieGenres, loadTVShowsGenres };
