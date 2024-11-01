import IMovie from "../../models/IMovie";
import {
    createAsyncThunk,
    createSlice,
    isPending,
    isRejected,
} from "@reduxjs/toolkit";
import {tmbdDataService} from "../../services/tmdbData.api.service";
import {AxiosError} from "axios";
import {setPaginationInfo} from "./paginationSlice";
import {store} from "../store";
import IErrorResponse from "../../models/IErrorResponse";
import IMoviesPaginated from "../../models/IMoviesPaginated";

interface IMoviesSlice {
    movies: IMovie[];
    chosenMovie: IMovie | null;
    loadingStateMovies: boolean;
}

interface ISearchQuery {
    searchByTitle: boolean,
    query: string;
}

const initialState: IMoviesSlice = {
    movies: [],
    chosenMovie: null,
    loadingStateMovies: false,
};

const moviesFiltering = (movies: IMoviesPaginated): IMoviesPaginated => {
    const {
        Search: {chosenGenresId},
    } = store.getState();
    Object.assign(movies, {
        results: movies.results?.filter((e: IMovie) =>
            chosenGenresId.reduce(
                (acc, curr) => (!acc ? acc : e.genre_ids.includes(curr)),
                true,
            ),
        ),
    });
    return movies;
}

const searchMovies = createAsyncThunk(
    "movies/searchMovies",
    async (searchQuery: ISearchQuery, thunkAPI) => {
        try {
            let movies: IMoviesPaginated
            searchQuery.searchByTitle
                ? movies = moviesFiltering(await tmbdDataService.searchMovies(searchQuery.query))
                : movies = await tmbdDataService.getMovies(searchQuery.query);
            thunkAPI.dispatch(setPaginationInfo(movies));
            return thunkAPI.fulfillWithValue(movies.results);
        } catch (e) {
            const error = e as AxiosError<IErrorResponse>;
            return thunkAPI.rejectWithValue(error.response?.data.status_message);
        } finally {
            thunkAPI.dispatch(MoviesActions.setLoadingState(false));
        }
    },
);

const endlessPaginationAction = createAsyncThunk(
    "movies/endlessPagination",
    async (searchQuery: ISearchQuery, thunkAPI) => {
        try {
            let movies: IMoviesPaginated
            searchQuery.searchByTitle
                ? movies = moviesFiltering(await tmbdDataService.searchMovies(searchQuery.query))
                : movies = await tmbdDataService.getMovies(searchQuery.query);
            thunkAPI.dispatch(setPaginationInfo(movies));
            return thunkAPI.fulfillWithValue(movies.results);
        } catch (e) {
            const error = e as AxiosError<IErrorResponse>;
            return thunkAPI.rejectWithValue(error.response?.data.status_message);
        } finally {
            thunkAPI.dispatch(MoviesActions.setLoadingState(false));
        }
    },
);


export const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        setChosenMovie: (state, action: { payload: IMovie }) => {
            state.chosenMovie = action.payload;
        },
        setLoadingState: (state, action) => {
            state.loadingStateMovies = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.movies = action.payload || [];
            })
            .addCase(endlessPaginationAction.fulfilled, (state, action) => {
                state.movies = [...state.movies, ...action.payload || []];
            })
            .addMatcher(
                isRejected(searchMovies, endlessPaginationAction),
                (state, action) => {
                    console.log(
                        "Movies receive sequence failed with error:",
                        action.payload,
                    );
                },
            )
            .addMatcher(
                isPending(searchMovies),
                (state) => {
                    state.loadingStateMovies = true;
                },
            );
    },
});

export const MoviesActions = {
    ...moviesSlice.actions,
    searchMovies,
    endlessPaginationAction
};
