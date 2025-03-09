import { FC, useEffect, useRef } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import translate from '../../assets/translate.json';
import { useAppSelector } from '../../redux/store';

import styles from './Menu.module.css';

const Menu: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const moviesRef = useRef<HTMLParagraphElement | null>(null);
  const tvShowRef = useRef<HTMLParagraphElement | null>(null);
  const underlineRef = useRef<HTMLDivElement | null>(null);
  const { language } = useAppSelector((state) => state.Language);

  useEffect(() => {
    const movieWidth = moviesRef.current?.getBoundingClientRect().width;
    const path = location.pathname;
    switch (true) {
      case ['/movies', '/movie_info'].includes(path):
        underlineRef.current?.setAttribute('style', `width:${movieWidth}px; transform: translateX(0)`);
        break;
      case ['/tv_shows', '/tv_show_info'].includes(path):
        underlineRef.current?.setAttribute(
          'style',
          `width:${tvShowRef.current?.getBoundingClientRect().width}px; transform: translateX(calc(${movieWidth}px + 5vw))`,
        );
        break;
      default:
        underlineRef.current?.setAttribute('style', `width: 0; transform: translateX(0)`);
    }
  }, [location.pathname, language]);
  return (
    <div className={styles.menu_wrapper}>
      <ul>
        <li>
          <p ref={moviesRef} onClick={() => navigate('/movies')}>
            {translate.Movies[language]}
          </p>
        </li>
        <li>
          <p ref={tvShowRef} onClick={() => navigate('/tv_shows')}>
            {translate.TV_Shows[language]}
          </p>
        </li>
      </ul>
      <div ref={underlineRef} className={styles.underline}></div>
    </div>
  );
};

export default Menu;
