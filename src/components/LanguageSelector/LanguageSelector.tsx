import React, {ChangeEvent, FC} from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import LanguageIcon from "../LanguageIcon/LanguageIcon";
import {LanguageEnum} from "../../enums/languageEnum";
import styles from './LanguageSelector.module.css'
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {setLanguage} from "../../redux/Slices/lenguageSlice";

const LanguageSelector: FC = () => {
    const dispatch = useAppDispatch()
    const handleChange = (event: ChangeEvent) => {
        const selectItem = event.currentTarget as HTMLSelectElement;
        dispatch(setLanguage(selectItem.value as LanguageEnum));
        localStorage.setItem("language", JSON.stringify(selectItem.value));
    };
    return (
        <select className={styles.language} name="fruit" onChange={handleChange}>
            <option value={LanguageEnum.US} selected>US</option>
            <option value={LanguageEnum.UA}>UA</option>
        </select>

    );
};

export default LanguageSelector;