import { FC } from 'react';

import { useLocation } from 'react-router-dom';

import IMovie from '../../models/IMovie';
import ITVShow from '../../models/ITVShow';
import { useAppSelector } from '../../redux/store';

import styles from './ProgressBar.module.css';

interface IProbes {
  observerPosition: number;
}

const ProgressBar: FC<IProbes> = ({ observerPosition }) => {
  const location = useLocation();
  const isMovies = ['/movies', '/movie_info'].includes(location.pathname);
  const {
    paginationFiltered: { total_pages, total_results },
  } = useAppSelector((state) => (isMovies ? state.PaginationMovies : state.PaginationTVShows));
  const { moviesFiltered } = useAppSelector((state) => state.Movies);
  const { tvShowsFiltered } = useAppSelector((state) => state.TVShows);
  const currentPosition = () => {
    const index =
      (isMovies ? moviesFiltered : tvShowsFiltered).findIndex(
        (e: ITVShow | IMovie): boolean => e.id === observerPosition,
      ) + 1;
    const marker = document.getElementsByClassName(styles.middle_mark)[0] as HTMLDivElement;
    marker?.setAttribute(
      'style',
      `top:${Math.round(((index - 1) / (total_pages > 500 ? 500 * 20 : total_results - 1)) * 100) - 2}%;  transition:top 1s`,
    );
    const base = document.getElementsByClassName(styles.bar)[0] as HTMLDivElement;
    base?.setAttribute('style', ` transition: opacity 0.3s; opacity:1;`);
    setTimeout(() => base?.setAttribute('style', ` transition: opacity 10s; opacity:0;`), 1000);

    return index;
  };
  return (
    <div className={styles.bar}>
      <div className={styles.top_mark}>
        <p>1</p>
      </div>
      <div className={styles.middle_mark}>
        <p>{currentPosition()}</p>
      </div>
      <div className={styles.bottom_mark}>
        <p>{total_pages > 500 ? 500 * 20 : total_results}</p>
      </div>
    </div>
  );
};

export default ProgressBar;
