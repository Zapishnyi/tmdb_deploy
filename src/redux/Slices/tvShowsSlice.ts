import { createAsyncThunk, createSlice, isPending, isRejected } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import IErrorResponse from '../../models/IErrorResponse';
import ITVShow from '../../models/ITVShow';
import ITVShowsPaginated from '../../models/ITVShowsPaginated';
import { get } from '../../services/getTMDBData.api.service';

import { PaginationTVShowAction } from './paginationTVShowSlice';

interface ITVShowsSlice {
  tvShowsDownloaded: ITVShow[];
  tvShowsFiltered: ITVShow[];
  chosenTVShow: ITVShow | null;
  loadingStateTVShows: boolean;
}

interface ISearchQuery {
  searchByTitle: boolean;
  query: string;
}

const initialState: ITVShowsSlice = {
  tvShowsDownloaded: [],
  tvShowsFiltered: [],
  chosenTVShow: null,
  loadingStateTVShows: false,
};

const TVShowsDownload = async (
  { query, searchByTitle }: ISearchQuery,
  TVShows: ITVShowsPaginated,
): Promise<ITVShowsPaginated> => {
  const TVShowsRecursion = async (
    query: string,
    searchByTitle: boolean,
    TVShows: ITVShowsPaginated,
  ): Promise<ITVShowsPaginated> => {
    const tempTVShows = await get.tvShow.byTitle(query);

    TVShows = { ...tempTVShows, results: [...(TVShows.results || []), ...(tempTVShows.results || [])] };
    if (tempTVShows.total_pages !== tempTVShows.page && tempTVShows.page <= 39) {
      console.log('TVShows downloads', tempTVShows.page, tempTVShows.results, tempTVShows.total_pages);
      TVShows = await TVShowsRecursion(query.replace(/(?<=page=)\d*/, (++tempTVShows.page).toString()), searchByTitle, {
        ...TVShows,
      });
    }
    return TVShows;
  };
  const TVShowsFound = await TVShowsRecursion(query, searchByTitle, TVShows);
  if (TVShowsFound.page === 40) {
    TVShowsFound.total_pages = 40;
    TVShowsFound.total_results = 800;
  }
  console.log('TVShows Found', TVShowsFound);
  return TVShowsFound;
};

const searchTVShows = createAsyncThunk('tvShows/searchTVShows', async (searchQuery: ISearchQuery, thunkAPI) => {
  try {
    let TVShows: ITVShowsPaginated = { page: 1, total_pages: 1, total_results: 0 };
    if (searchQuery.searchByTitle) {
      console.log('search by title');
      TVShows = await TVShowsDownload(searchQuery, TVShows);
    } else {
      console.log('search not by title');
      TVShows = await get.tvShow.byGenres(searchQuery.query);
    }
    console.log('fouind TVShows', TVShows);
    thunkAPI.dispatch(PaginationTVShowAction.setPaginationDownloaded(TVShows));
    return thunkAPI.fulfillWithValue(TVShows.results);
  } catch (e) {
    const error = e as AxiosError<IErrorResponse>;
    return thunkAPI.rejectWithValue(error.response?.data.status_message);
  } finally {
    thunkAPI.dispatch(TVShowsActions.setLoadingState(false));
  }
});

const endlessPaginationAction = createAsyncThunk(
  'tvShows/endlessPagination',
  async (searchQuery: ISearchQuery, thunkAPI) => {
    try {
      const TVShows = await get.tvShow.byGenres(searchQuery.query);

      thunkAPI.dispatch(PaginationTVShowAction.setPaginationDownloaded(TVShows));
      return thunkAPI.fulfillWithValue(TVShows.results);
    } catch (e) {
      const error = e as AxiosError<IErrorResponse>;
      return thunkAPI.rejectWithValue(error.response?.data.status_message);
    } finally {
      thunkAPI.dispatch(TVShowsActions.setLoadingState(false));
    }
  },
);

export const tvShowsSlice = createSlice({
  name: 'tvShows',
  initialState,
  reducers: {
    setChosenTVShow: (state, action) => {
      state.chosenTVShow = action.payload;
    },
    setLoadingState: (state, action) => {
      state.loadingStateTVShows = action.payload;
    },
    setTVShowsFiltered: (state, action) => {
      state.tvShowsFiltered = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTVShows.fulfilled, (state, action) => {
        state.tvShowsDownloaded = action.payload || [];
      })
      .addCase(endlessPaginationAction.fulfilled, (state, action) => {
        state.tvShowsDownloaded = [...state.tvShowsDownloaded, ...(action.payload || [])];
      })
      .addMatcher(isRejected(searchTVShows, endlessPaginationAction), (state, action) => {
        console.log('TVShows receive sequence failed with error:', action.payload);
      })
      .addMatcher(isPending(searchTVShows), (state) => {
        state.loadingStateTVShows = true;
      });
  },
});

export const TVShowsActions = {
  ...tvShowsSlice.actions,
  searchTVShows,
  endlessPaginationAction,
};
