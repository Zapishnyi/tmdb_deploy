import {createSlice} from "@reduxjs/toolkit";

interface IChosenPage {
    chosenPageMovie: number;
    chosenPageTVShow: number;
}

const initialState: IChosenPage = {
    chosenPageMovie: 1,
    chosenPageTVShow: 1,
};

export const chosenPageSlice = createSlice({
    name: "chosenPage",
    initialState,
    reducers: {
        setChosenPageMovie: (state, action) => {
            state.chosenPageMovie = action.payload;
        },
        setChosenPageTVShow: (state, action) => {
            state.chosenPageTVShow = action.payload;
        },
    },
});

export const {setChosenPageMovie, setChosenPageTVShow} = chosenPageSlice.actions;
