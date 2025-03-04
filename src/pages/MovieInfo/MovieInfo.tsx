import { FC, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

import BackButton from '../../components/BackButton/BackButton';
import GenresBadgeSet from '../../components/GenresBadgeSet/GenresBadgeSet';
import ImagePreview from '../../components/MovieImagePreview/ImagePreview';
import { errorImage } from '../../constants/errorImagePath';
import { CloseSearchPanel } from '../../helpers/CloseSearchPanel';
import { getLanguageName } from '../../helpers/GetLanguageName';
import { MoviesDetailsActions } from '../../redux/Slices/movieDetailsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';

import styles from './MovieInfo.module.css';

const MovieInfo: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { credits, images, movies, loadingStateDetails } = useAppSelector((state) => state.MovieDetails);
  const movieCosen = movies.filter((e) => e.id === Number(chosenMovie?.id))[0];
  const creditsChosen = credits.filter((e) => e.id === Number(chosenMovie?.id))[0];
  const imagesChosen = images.filter((e) => e.id === Number(chosenMovie?.id))[0];
  const { chosenMovie } = useAppSelector((state) => state.Movies);

  useEffect(() => {
    if (!chosenMovie) {
      navigate('/movies');
    }

    if (!movies.filter((e) => e.id === Number(chosenMovie?.id)).length && chosenMovie) {
      dispatch(MoviesDetailsActions.getMovieDetails(chosenMovie?.id));
      dispatch(MoviesDetailsActions.getCredits(chosenMovie?.id));
      dispatch(MoviesDetailsActions.getImages(chosenMovie?.id));
    }
  }, []);

  return (
    <div className={styles.base} onClick={CloseSearchPanel}>
      {chosenMovie && (
        <div className={styles.scrollContainer}>
          <div className={styles.container}>
            <div className={styles.short_info}>
              <div className={styles.genresContainer}>
                <GenresBadgeSet key={chosenMovie.id} genres_ids={chosenMovie.genre_ids} />
                <ImagePreview
                  poster_path={chosenMovie.backdrop_path}
                  title={chosenMovie.original_title}
                  error_image_path={errorImage.movieImage}
                  width_desktop={'45vw'}
                  width_mobile={'95vw'}
                  aspect_ratio={1.78}
                />
              </div>
              <div className={styles.info}>
                <div>
                  <h1>{chosenMovie.title}</h1>
                  <StarRatings
                    rating={(chosenMovie.vote_average * 6) / 10}
                    starDimension="20px"
                    starSpacing="2px"
                    numberOfStars={6}
                    starRatedColor="#ff5600"
                    starEmptyColor="#b1b1b1"
                  />
                </div>

                <p>Release date: {chosenMovie.release_date}</p>
                <p>Language: {getLanguageName(chosenMovie.original_language)}</p>
                <a href={tvShow.homepage} target="blank" rel="noopener noreferrer">
                  Homepage
                </a>
                {chosenMovie.adult && <p className={styles.adultContentWarning}>Parental advisory: explicit content</p>}
              </div>
            </div>
            <p className={styles.overview}>{chosenMovie.overview}</p>
          </div>
          <div className={styles.backButton}>
            <BackButton to={'/movies'} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieInfo;
