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
  try {
    const images = await get.movie.images(movie_id);

    return thunkAPI.fulfillWithValue(images);
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(MoviesDetailsActions.setLoadingState(false));
  }
});

const getVideos = createAsyncThunk('movieDetails/getVideos', async (movie_id: number, thunkAPI) => {
  try {
    const videos = await get.movie.videos(movie_id);
    console.log('videos', videos);
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
    clearFilms: (state) => {
      state.movies = [];
    },
    clearCredits: (state) => {
      state.credits = [];
    },
    clearImages: (state) => {
      state.images = [];
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
      .addMatcher(isRejected(getMovieDetails, getCredits, getImages), (state, action) => {
        console.error('Movie details receive sequence failed with error:', action.payload);
      })
      .addMatcher(isPending(getMovieDetails, getCredits, getImages), (state) => {
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
