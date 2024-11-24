import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IAppLanguage} from "../../models/IAppLanguage";
import {LanguageEnum} from "../../enums/languageEnum";


const initialState: IAppLanguage = {
    language: JSON.parse(localStorage.getItem("language") || '"us"'),
};

export const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<LanguageEnum>) => {
            state.language = action.payload;
        },
    },
});

export const {setLanguage} = languageSlice.actions;
