import {
    createAsyncThunk,
    createSlice,
    isPending,
    isRejected,
} from "@reduxjs/toolkit";
import {tmbdDataService} from "../../services/tmdbData.api.service";
import {AxiosError} from "axios";
import IGenre from "../../models/IGenre";
import IErrorResponse from "../../models/IErrorResponse";

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
    searchNameMovie: "",
    searchNameTVShow: "",
    genresTVShows: [],
    genresMovies: [],
    chosenGenresMoviesId: [],
    chosenGenresTVShowsId: [],
    loadingStateGenres: false,
};

const loadMovieGenres = createAsyncThunk(
    "genres/loadMovieGenres",
    async (_, thunkAPI) => {
        try {
            const genres = await tmbdDataService.getMovieGenres.then(
                ({genres}) => genres,
            );
            return thunkAPI.fulfillWithValue(genres);
        } catch (e) {
            const error = e as AxiosError<IErrorResponse>;
            return thunkAPI.rejectWithValue(error.response?.data.status_message);
        } finally {
            thunkAPI.dispatch(SearchActions.setLoadingState(false));
        }
    },
);

const loadTVShowsGenres = createAsyncThunk(
    "genres/loadTVShowGenres",
    async (_, thunkAPI) => {
        try {
            const genres = await tmbdDataService.getTVShowGenres.then(
                ({genres}) => genres,
            );
            return thunkAPI.fulfillWithValue(genres);
        } catch (e) {
            const error = e as AxiosError<IErrorResponse>;
            return thunkAPI.rejectWithValue(error.response?.data.status_message);
        } finally {
            thunkAPI.dispatch(SearchActions.setLoadingState(false));
        }
    },
);


export const searchSlice = createSlice({
    name: "genres",
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
                console.log(
                    "Genres receive sequence failed with error:",
                    action.payload,
                );
            })
            .addMatcher(isPending(loadMovieGenres, loadTVShowsGenres), (state) => {
                state.loadingStateGenres = true;
            });
    },
});

export const SearchActions = {...searchSlice.actions, loadMovieGenres, loadTVShowsGenres};
