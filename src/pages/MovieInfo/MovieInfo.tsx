import * as React from 'react';
import { FC, useEffect } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import StarRatings from 'react-star-ratings';

import translate from '../../assets/translation/translate.json';
import AvatarIcon from '../../components/AvatarIcon/AvatarIcon';
import BackButton from '../../components/BackButton/BackButton';
import GenresBadgeSet from '../../components/GenresBadgeSet/GenresBadgeSet';
import ImagePreview from '../../components/MovieImagePreview/ImagePreview';
import YouTubeVideo from '../../components/YouTobeVideo/YouTubeVideo';
import { errorImage } from '../../constants/errorImagePath';
import { urlImage } from '../../constants/tmdbURLS';
import { budgetReformat } from '../../helpers/BudgetReformat';
import { closeSearchPanel } from '../../helpers/CloseSearchPanel';
import { getLanguageName } from '../../helpers/GetLanguageName';
import { MoviesDetailsActions } from '../../redux/Slices/movieDetailsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';

import styles from './MovieInfo.module.css';

const MovieInfo: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { chosenMovie } = useAppSelector((state) => state.Movies);
  const { language } = useAppSelector((state) => state.Language);
  const { credits, images, movies, videos, loadingStateDetails } = useAppSelector((state) => state.MovieDetails);
  const movieDetailsChosen = movies.filter((e) => e.id === Number(chosenMovie?.id))[0];
  const creditsChosen = credits.filter((e) => e.id === Number(chosenMovie?.id))[0];
  const imagesChosen = images.filter((e) => e.id === Number(chosenMovie?.id))[0];
  const videosChosen = videos.filter((e) => e.id === Number(chosenMovie?.id))[0];

  useEffect(() => {
    if (!chosenMovie) {
      navigate('/movies');
    }

    if (!movies.filter((e) => e.id === Number(chosenMovie?.id)).length && chosenMovie) {
      dispatch(MoviesDetailsActions.getMovieDetails(chosenMovie?.id));
      dispatch(MoviesDetailsActions.getCredits(chosenMovie?.id));
      dispatch(MoviesDetailsActions.getImages(chosenMovie?.id));
      dispatch(MoviesDetailsActions.getVideos(chosenMovie?.id));
    }
  }, [language]);
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleExpandChange = (panel: string) => {
    setExpanded(panel === expanded ? false : panel);
  };

  return (
    <div className={styles.base} onClick={closeSearchPanel}>
      {loadingStateDetails ? (
        <div className={styles.spinner}>
          <FadeLoader color="#9d9deb" />
        </div>
      ) : (
        <>
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
                      <h1>{movieDetailsChosen?.title}</h1>
                      <StarRatings
                        rating={(chosenMovie.vote_average * 6) / 10}
                        starDimension="20px"
                        starSpacing="2px"
                        numberOfStars={6}
                        starRatedColor="#ff5600"
                        starEmptyColor="#b1b1b1"
                      />
                    </div>

                    <p> {`${translate.Release_date[language]} ${chosenMovie.release_date}`}</p>
                    <p>{`${translate.Language[language]} ${getLanguageName(chosenMovie.original_language)}`}</p>
                    {movieDetailsChosen && (
                      <>
                        {!!movieDetailsChosen.homepage && (
                          <a href={movieDetailsChosen.homepage} target="blank" rel="noopener noreferrer">
                            {translate.Homepage[language]}
                          </a>
                        )}
                        <p>{`${translate.Budget[language]} ${budgetReformat(movieDetailsChosen.budget)} USD`}</p>
                      </>
                    )}

                    {chosenMovie.adult && (
                      <p className={styles.adultContentWarning}>Parental advisory: explicit content</p>
                    )}
                  </div>
                </div>
                <p className={styles.overview}>{movieDetailsChosen?.overview}</p>
                <div className={styles.accordion}>
                  {movieDetailsChosen?.production_companies?.length > 0 && (
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                      >
                        <span>{translate.Studios[language]}</span>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div
                          className={`${styles.production_companies} ${styles.panel}`}
                          onClick={() => {
                            handleExpandChange('panel1');
                          }}
                        >
                          {movieDetailsChosen.production_companies.map((e, i) =>
                            e.logo_path ? (
                              <img key={i} src={urlImage(e.logo_path)} alt={e.name} />
                            ) : (
                              <p key={i}>{e.name}</p>
                            ),
                          )}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  {!!creditsChosen?.cast?.length && (
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <span>{translate.Cast[language]}</span>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div
                          className={`${styles.cast} ${styles.panel}`}
                          onClick={() => {
                            handleExpandChange('panel2');
                          }}
                        >
                          {creditsChosen.cast.map((e, i) => (
                            <AvatarIcon key={i} name={e.name} iconPath={e.profile_path} nameAlt={`as ${e.character}`} />
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  {!!creditsChosen?.crew?.length && (
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                      >
                        <span>{translate.Crew[language]}</span>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div
                          className={`${styles.cast} ${styles.panel}`}
                          onClick={() => {
                            handleExpandChange('panel3');
                          }}
                        >
                          {creditsChosen.crew.map((e, i) => (
                            <AvatarIcon key={i} name={e.name} iconPath={e.profile_path} />
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  {!!imagesChosen?.backdrops?.length && (
                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4-content"
                        id="panel4-header"
                      >
                        <span>{translate.Images[language]}</span>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div
                          className={`${styles.images} ${styles.panel}`}
                          onClick={() => {
                            handleExpandChange('panel4');
                          }}
                        >
                          {imagesChosen.backdrops.map((e, i) => (
                            <img key={i} src={urlImage(e.file_path)} alt={chosenMovie.original_title} />
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  {!!imagesChosen?.posters?.length && (
                    <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel5-content"
                        id="panel5-header"
                      >
                        <span>{translate.Posters[language]}</span>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div
                          className={`${styles.posters} ${styles.panel}`}
                          onClick={() => {
                            handleExpandChange('panel5');
                          }}
                        >
                          {imagesChosen.posters.map((e, i) => (
                            <img key={i} src={urlImage(e.file_path)} alt={chosenMovie.original_title} />
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}
                  {!!videosChosen?.results?.length && (
                    <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel6-content"
                        id="panel6-header"
                      >
                        <span>{translate.Videos[language]}</span>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div
                          className={`${styles.videos} ${styles.panel}`}
                          onClick={() => {
                            handleExpandChange('panel6');
                          }}
                        >
                          {videosChosen.results.map((e, i) => (
                            <YouTubeVideo key={i} videoInfo={e} />
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </div>
              </div>
              <div className={styles.backButton}>
                <BackButton to={'/movies'} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieInfo;
