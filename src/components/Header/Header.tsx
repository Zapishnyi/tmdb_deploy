import { FC, useEffect } from 'react';

import { SearchActions } from '../../redux/Slices/searchSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Logo from '../Logo/Logo';
import Menu from '../Menu/Menu';
import SearchController from '../SearchController/SearchController';
import Settings from '../Settings/Settings';

import styles from './Header.module.css';

const Header: FC = () => {
  const dispatch = useAppDispatch();

  const { language } = useAppSelector((state) => state.Language);

  useEffect(() => {
    dispatch(SearchActions.loadMovieGenres());
    dispatch(SearchActions.loadTVShowsGenres());
  }, [language]);

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <Logo />
        <Menu />
        <div className={styles.instruments}>
          <SearchController />
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Header;
