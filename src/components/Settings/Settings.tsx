import { FC } from 'react';

import { setTheme } from '../../redux/Slices/themeSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import ColorThemeToggle from '../ColorThemeToggle/ColorThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { SettingsSVG } from '../SettingsSVG/SettingsSVG';

import styles from './Settings.module.css';

const Settings: FC = () => {
  const dispatch = useAppDispatch();
  const { lightThemeOn } = useAppSelector((state) => state.Theme);
  const onToggle = () => {
    dispatch(setTheme(!lightThemeOn));
    localStorage.setItem('lightThemeOn', JSON.stringify(!lightThemeOn));
  };
  return (
    <div className={styles.user}>
      <SettingsSVG />
      <ul className={styles.menu}>
        <li onClick={onToggle}>
          <ColorThemeToggle />
        </li>
        <li>
          <LanguageSelector />
        </li>
      </ul>
    </div>
  );
};

export default Settings;
