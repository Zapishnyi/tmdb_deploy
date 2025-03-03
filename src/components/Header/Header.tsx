import { FC, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import TMDBLogo from '../../assets/images/TMDB_logo2.png';
import ViewTransitionHandle from '../../helpers/ViewTransitionHandle';
import { SearchActions } from '../../redux/Slices/searchSlice';
import { useAppDispatch } from '../../redux/store';
import SearchComponent from '../SearchComponent/SearchComponent';
import SearchMenuCloseBtn from '../SearchMenuCloseBtn/SearchMenuCloseBtn';
import SearchMenuOpenBtn from '../SearchMenuOpenBtn/SearchMenuOpenBtn';
import Settings from '../Settings/Settings';

import './Header.css';
import styles from './Header.module.css';

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isMovie = ['/movies', '/movie_info'].includes(location.pathname);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(SearchActions.loadMovieGenres());
    dispatch(SearchActions.loadTVShowsGenres());
  }, []);

  return (
    <div className={styles.header} id={'header'}>
      <div className={styles.container}>
        <div onClick={() => ViewTransitionHandle('/movies', navigate)} className={styles.logo}>
          <img src={TMDBLogo} alt="Logo" />
        </div>
        <div className={styles.menu_wrapper}>
          <ul>
            <li>
              <p onClick={() => ViewTransitionHandle('/movies', navigate)}>Movies</p>
            </li>
            <li>
              <p onClick={() => ViewTransitionHandle('/tv_shows', navigate)}>TV Shows</p>
            </li>
          </ul>
          <div className={[styles.underline, !isMovie ? styles.right : ''].join(' ')}></div>
        </div>
        <div className={styles.instruments}>
          <div className={[styles.searchButton, 'searchButton'].join(' ')}>
            <SearchMenuOpenBtn />
            <SearchMenuCloseBtn />
          </div>
          <div className={styles.themeUserContainer}>
            <Settings />
          </div>
        </div>
        <div className={[styles.searchComponent, 'search'].join(' ')}>
          <SearchComponent />
        </div>
      </div>
    </div>
  );
};

export default Header;
