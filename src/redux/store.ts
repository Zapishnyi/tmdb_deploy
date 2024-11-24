import {configureStore} from "@reduxjs/toolkit";
import {moviesSlice} from "./Slices/moviesSlice";
import {searchSlice} from "./Slices/searchSlice";
import {paginationMovieSlice} from "./Slices/paginationMovieSlice";
import {themeSlice} from "./Slices/themeSlice";
import {useDispatch, useSelector} from "react-redux";
import {chosenPageSlice} from "./Slices/chosenPageSlice";
import {paginationTVShowSlice} from "./Slices/paginationTVShowSlice";
import {tvShowsSlice} from "./Slices/tvShowsSlice";
import {languageSlice} from "./Slices/lenguageSlice";

export const store = configureStore({
    reducer: {
        Movies: moviesSlice.reducer,
        TVShows: tvShowsSlice.reducer,
        Search: searchSlice.reducer,
        PaginationMovies: paginationMovieSlice.reducer,
        PaginationTVShows: paginationTVShowSlice.reducer,
        Theme: themeSlice.reducer,
        ChosenPage: chosenPageSlice.reducer,
        Language: languageSlice.reducer,
    },
});

export const useAppSelector =
    useSelector.withTypes<ReturnType<typeof store.getState>>();

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>();
