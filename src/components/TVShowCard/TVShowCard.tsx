import React, { FC, memo } from 'react';

import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

import { errorImage } from '../../constants/errorImagePath';
import { closeSearchPanel } from '../../helpers/CloseSearchPanel';
import { SearchFade } from '../../helpers/SearchFade';
import ViewTransitionHandle from '../../helpers/ViewTransitionHandle';
import ITVShow from '../../models/ITVShow';
import { PaginationTVShowAction } from '../../redux/Slices/paginationTVShowSlice';
import { TVShowsActions } from '../../redux/Slices/tvShowsSlice';
import { useAppDispatch } from '../../redux/store';
import ImagePreview from '../MovieImagePreview/ImagePreview';

import styles from './TVShowCard.module.css';

interface IProps {
  tvShow: ITVShow;
}

const TVShowCard: FC<IProps> = memo(({ tvShow }) => {
  console.log('.');
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const movieChoseHandler = () => {
    dispatch(TVShowsActions.setChosenTVShow(tvShow));

    SearchFade();
    closeSearchPanel();
    ViewTransitionHandle('/tv_show_info', navigate);
  };

  const hoverHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    dispatch(PaginationTVShowAction.setObserverPosition(Number(e.currentTarget.className.match(/(?<=id_)\d*/))));
  };

  return (
    <div
      onClick={movieChoseHandler}
      onMouseEnter={hoverHandler}
      className={[styles.card, 'observed', `id_${tvShow.id}`].join(' ')}
    >
      <ImagePreview
        poster_path={tvShow.poster_path}
        title={tvShow.original_name}
        error_image_path={errorImage.poster}
        width_desktop={'300px'}
        width_mobile={'300px'}
        aspect_ratio={0.66}
      />
      <div className={styles.stars}>
        <StarRatings
          rating={(tvShow.vote_average * 6) / 10 || 0}
          starDimension="20px"
          starSpacing="2px"
          numberOfStars={6}
          starRatedColor="#ff5600"
          starEmptyColor="#b1b1b1"
        />
      </div>
      <h4>{tvShow.name}</h4>
    </div>
  );
});

export default TVShowCard;
