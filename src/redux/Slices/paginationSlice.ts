import IMoviesPaginated from "../../models/IMoviesPaginated";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface IPaginationSlice {
    page: number;
    total_pages: number;
    total_results: number;
    observer_position: number;
    scroll_position: number;
}

const initialState: IPaginationSlice = {
    page: 1,
    total_pages: 1,
    total_results: 0,
    observer_position: 0,
    scroll_position: 0,
};

export const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        setPaginationInfo: (
            state,
            {
                payload: {page, total_pages, total_results},
            }: PayloadAction<IMoviesPaginated>,
        ) => {
            state.page = state.page > total_pages ? 1 : page;
            state.total_results = total_results;
            state.total_pages = total_pages;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setObserverPosition: (state, action) => {
            state.observer_position = action.payload;
        },
        setScrollPosition: (state, action) => {
            state.scroll_position = action.payload;
        }
    },
});

export const {setPage, setPaginationInfo, setObserverPosition, setScrollPosition} = paginationSlice.actions;
