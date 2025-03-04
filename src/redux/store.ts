import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { chosenPageSlice } from './Slices/chosenPageSlice';
import { languageSlice } from './Slices/languageSlice';
import { movieDetailsSlice } from './Slices/movieDetailsSlice';
import { moviesSlice } from './Slices/moviesSlice';
import { paginationMovieSlice } from './Slices/paginationMovieSlice';
import { paginationTVShowSlice } from './Slices/paginationTVShowSlice';
import { searchSlice } from './Slices/searchSlice';
import { themeSlice } from './Slices/themeSlice';
import { tvShowsSlice } from './Slices/tvShowsSlice';

export const store = configureStore({
  reducer: {
    Movies: moviesSlice.reducer,
    MovieDetails: movieDetailsSlice.reducer,
    TVShows: tvShowsSlice.reducer,
    Search: searchSlice.reducer,
    PaginationMovies: paginationMovieSlice.reducer,
    PaginationTVShows: paginationTVShowSlice.reducer,
    Theme: themeSlice.reducer,
    ChosenPage: chosenPageSlice.reducer,
    Language: languageSlice.reducer,
  },
});

export const useAppSelector = useSelector.withTypes<ReturnType<typeof store.getState>>();
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
