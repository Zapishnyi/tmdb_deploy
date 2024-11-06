import IMovie from "../../models/IMovie";
import {createAsyncThunk, createSlice, isPending, isRejected,} from "@reduxjs/toolkit";
import {tmbdDataService} from "../../services/tmdbData.api.service";
import {AxiosError} from "axios";
import IErrorResponse from "../../models/IErrorResponse";
import IMoviesPaginated from "../../models/IMoviesPaginated";
import {setPaginationDownloaded} from "./paginationSlice";

interface IMoviesSlice {
    moviesDownloaded: IMovie[];
    moviesFiltered: IMovie[];
    chosenMovie: IMovie | null;
    loadingStateMovies: boolean;
}

interface ISearchQuery {
    searchByTitle: boolean,
    query: string;
}

const initialState: IMoviesSlice = {
    moviesDownloaded: [],
    moviesFiltered: [],
    chosenMovie: null,
    loadingStateMovies: false,
};


const moviesDownload = async ({
                                  query,
                                  searchByTitle
                              }: ISearchQuery, movies: IMoviesPaginated): Promise<IMoviesPaginated> => {

    const moviesRecursion = async (query: string, searchByTitle: boolean, movies: IMoviesPaginated): Promise<IMoviesPaginated> => {
        const tempMovies = await tmbdDataService.searchMovies(query)

        movies = {...tempMovies, results: [...movies.results || [], ...tempMovies.results || []]};
        if (tempMovies.total_pages !== tempMovies.page && tempMovies.page <= 39) {
            console.log("movie downloads", tempMovies.page, tempMovies.results, tempMovies.total_pages)
            movies = await moviesRecursion(
                query.replace(/(?<=page=)\d*/, (++tempMovies.page).toString()),
                searchByTitle,
                {...movies})

        }
        return movies
    }
    const moviesFound = await moviesRecursion(query, searchByTitle, movies);
    if (moviesFound.page === 40) {
        moviesFound.total_pages = 40;
        moviesFound.total_results = 800;
    }
    console.log("movies Found", moviesFound)
    return moviesFound;
}

const searchMovies = createAsyncThunk(
    "movies/searchMovies",
    async (searchQuery: ISearchQuery, thunkAPI) => {
        try {
            let movies: IMoviesPaginated = {page: 1, total_pages: 1, total_results: 0};
            if (searchQuery.searchByTitle) {
                console.log("search by title")
                movies = await moviesDownload(searchQuery, movies);

            } else {
                console.log("search not by title")
                movies = await tmbdDataService.getMovies(searchQuery.query)
            }
            console.log('fouind movies', movies)
            thunkAPI.dispatch(setPaginationDownloaded(movies));
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


            const movies = await tmbdDataService.getMovies(searchQuery.query);

            thunkAPI.dispatch(setPaginationDownloaded(movies));
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
        setMoviesFiltered: (state, action) => {
            state.moviesFiltered = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.moviesDownloaded = action.payload || [];

            })
            .addCase(endlessPaginationAction.fulfilled, (state, action) => {
                state.moviesDownloaded = [...state.moviesDownloaded, ...action.payload || []];
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
