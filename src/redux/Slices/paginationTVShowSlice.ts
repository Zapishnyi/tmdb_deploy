import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import ITVShowsPaginated from '../../models/ITVShowsPaginated';

interface IPaginationSlice {
  paginationDownloaded: {
    page: number;
    total_pages: number;
    total_results: number;
  };
  paginationFiltered: {
    page: number;
    total_pages: number;
    total_results: number;
  };
  observer_position: number;
  scroll_position: number;
}

const initialState: IPaginationSlice = {
  paginationDownloaded: {
    page: 1,
    total_pages: 1,
    total_results: 0,
  },
  paginationFiltered: {
    page: 1,
    total_pages: 1,
    total_results: 0,
  },
  observer_position: 0,
  scroll_position: 0,
};

export const paginationTVShowSlice = createSlice({
  name: 'pagination_tv_show',
  initialState,
  reducers: {
    setPaginationDownloaded: (
      state,
      { payload: { page, total_pages, total_results } }: PayloadAction<ITVShowsPaginated>,
    ) => {
      state.paginationDownloaded.page = state.paginationDownloaded.page > total_pages ? 1 : page;
      state.paginationDownloaded.total_results = total_results;
      state.paginationDownloaded.total_pages = total_pages;
    },
    setPaginationFiltered: (
      state,
      { payload: { page, total_pages, total_results } }: PayloadAction<ITVShowsPaginated>,
    ) => {
      state.paginationFiltered.page = state.paginationFiltered.page > total_pages ? 1 : page;
      state.paginationFiltered.total_results = total_results;
      state.paginationFiltered.total_pages = total_pages;
    },
    setPage: (state, action) => {
      state.paginationFiltered.page = action.payload;
    },
    setObserverPosition: (state, action) => {
      state.observer_position = action.payload;
    },
    setScrollPosition: (state, action) => {
      state.scroll_position = action.payload;
    },
  },
});

export const PaginationTVShowAction = paginationTVShowSlice.actions;
