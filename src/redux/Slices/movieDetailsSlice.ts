import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { ICredits } from '../../models/ICredits';
import IErrorResponse from '../../models/IErrorResponse';
import IImages from '../../models/IImages';
import IMovieDetails from '../../models/IMovieDetails';
import IVideos from '../../models/IVideos';
import { get } from '../../services/getTMDBData.api.service';
import { RootState } from '../store';

interface IMoviesDetailsSlice {
  movies: IMovieDetails[];
  credits: ICredits[];
  images: IImages[];
  videos: IVideos[];
  loadingStateDetails: boolean;
}

const initialState: IMoviesDetailsSlice = {
  movies: [],
  credits: [],
  images: [],
  videos: [],
  loadingStateDetails: false,
};

const getMovieDetails = createAsyncThunk('movieDetails/getMovieDetails', async (movie_id: number, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    const movieDetails = await get.movie.byId(movie_id, state.Language.language);
    return thunkAPI.fulfillWithValue(movieDetails);
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(MoviesDetailsActions.setLoadingState(false));
  }
});

const getCredits = createAsyncThunk('movieDetails/getCredits', async (movie_id: number, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    const credits = await get.movie.credits(movie_id, state.Language.language);
    return thunkAPI.fulfillWithValue(credits);
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(MoviesDetailsActions.setLoadingState(false));
  }
});

const getImages = createAsyncThunk('movieDetails/getImages', async (movie_id: number, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    const images = await get.movie.images(movie_id, state.Language.language);

    return thunkAPI.fulfillWithValue({
      ...images,
      posters: images.posters.filter((poster) => state.Language.language.includes(poster?.iso_639_1 || '')),
    });
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(MoviesDetailsActions.setLoadingState(false));
  }
});

const getVideos = createAsyncThunk('movieDetails/getVideos', async (movie_id: number, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    const videos = await get.movie.videos(movie_id, state.Language.language);
    return thunkAPI.fulfillWithValue(videos);
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(MoviesDetailsActions.setLoadingState(false));
  }
});

export const movieDetailsSlice = createSlice({
  name: 'movieDetails',
  initialState,
  reducers: {
    clearFilmsDetails: (state) => {
      state.movies = [];
      state.credits = [];
      state.images = [];
      state.videos = [];
    },
    setLoadingState: (state, action) => {
      state.loadingStateDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovieDetails.fulfilled, (state, action) => {
        state.movies = [...state.movies, action.payload];
      })
      .addCase(getCredits.fulfilled, (state, action) => {
        state.credits = [...state.credits, action.payload];
      })
      .addCase(getImages.fulfilled, (state, action) => {
        state.images = [...state.images, action.payload];
      })
      .addCase(getVideos.fulfilled, (state, action) => {
        state.videos = [...state.videos, action.payload];
      })
      .addMatcher(isRejected(getMovieDetails, getCredits, getImages, getVideos), (state, action) => {
        console.error('Movie details receive sequence failed with error:', action.payload);
      })
      .addMatcher(isPending(getMovieDetails, getCredits, getImages, getVideos), (state) => {
        state.loadingStateDetails = true;
      });
  },
});

export const MoviesDetailsActions = {
  ...movieDetailsSlice.actions,
  getMovieDetails,
  getCredits,
  getImages,
  getVideos,
};
