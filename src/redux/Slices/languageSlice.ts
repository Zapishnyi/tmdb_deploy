import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LanguageEnum } from '../../enums/languageEnum';
import { IAppLanguage } from '../../models/IAppLanguage';

const initialState: IAppLanguage = {
  language: JSON.parse(localStorage.getItem('language') || '"us"') as LanguageEnum,
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageEnum>) => {
      state.language = action.payload;
      localStorage.setItem('language', JSON.stringify(action.payload));
    },
  },
});

export const { setLanguage } = languageSlice.actions;
