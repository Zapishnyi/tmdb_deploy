import { FC, useEffect, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import TMDBLogo from '../../assets/images/TMDB_logo2.png';
import translate from '../../assets/translate.json';
import { SearchActions } from '../../redux/Slices/searchSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import SearchComponent from '../SearchComponent/SearchComponent';
import SearchMenuCloseBtn from '../SearchMenuCloseBtn/SearchMenuCloseBtn';
import SearchMenuOpenBtn from '../SearchMenuOpenBtn/SearchMenuOpenBtn';
import Settings from '../Settings/Settings';

import './Header.css';
import styles from './Header.module.css';

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { language } = useAppSelector((state) => state.Language);
  const isMovie = ['/tv_shows', '/tv_show_info'].includes(location.pathname);
  console.log('isMovie', isMovie);
  const navigate = useNavigate();
  const moviesRef = useRef<HTMLParagraphElement | null>(null);
  const tvShowRef = useRef<HTMLParagraphElement | null>(null);
  const underlineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const movieWidth = moviesRef.current?.getBoundingClientRect().width;
    underlineRef.current?.setAttribute('style', `width:${movieWidth}px; `);
  }, []);

  useEffect(() => {
    dispatch(SearchActions.loadMovieGenres());
    dispatch(SearchActions.loadTVShowsGenres());
    const movieWidth = moviesRef.current?.getBoundingClientRect().width;
    underlineRef.current?.setAttribute(
      'style',
      `width:${
        ['/movies', '/movie_info'].includes(location.pathname)
          ? moviesRef.current?.getBoundingClientRect().width
          : tvShowRef.current?.getBoundingClientRect().width
      }px;  
      transform: translateX(${
        ['/movies', '/movie_info'].includes(location.pathname) ? 0 : `calc(${movieWidth}px + 5vw)`
      }) `,
    );
  }, [language]);

  const viewTransitionHandle = (e: React.MouseEvent<HTMLDivElement>, to: string): void => {
    const movieWidth = moviesRef.current?.getBoundingClientRect().width;
    if (e.currentTarget.classList.contains(styles.logo)) {
      underlineRef.current?.setAttribute('style', `width:${movieWidth}px; `);
    } else {
      underlineRef.current?.setAttribute(
        'style',
        `width:${e.currentTarget.getBoundingClientRect().width}px; 
        transform: translateX(${to === '/movies' ? 0 : `calc(${movieWidth}px + 5vw)`})`,
      );
    }
    // if (document.startViewTransition) {
    //   document.startViewTransition(() => {
    //     navigate(to);
    //   });
    // } else {
    navigate(to);
    // }
  };

  return (
    <div className={styles.header} id={'header'}>
      <div className={styles.container}>
        <div onClick={(e) => viewTransitionHandle(e, '/movies')} className={styles.logo}>
          <img src={TMDBLogo} alt="Logo" />
        </div>
        <div className={styles.menu_wrapper}>
          <ul>
            <li>
              <p ref={moviesRef} onClick={(e) => viewTransitionHandle(e, '/movies')}>
                {translate.Movies[language]}
              </p>
            </li>
            <li>
              <p ref={tvShowRef} onClick={(e) => viewTransitionHandle(e, '/tv_shows')}>
                {translate.TV_Shows[language]}
              </p>
            </li>
          </ul>
          <div ref={underlineRef} className={[styles.underline, isMovie ? styles.right : ''].join(' ')}></div>
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
