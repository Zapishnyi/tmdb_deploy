import React, {FC, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../redux/store";
import styles from "./TVShowInfo.module.css";
import ImagePreview from "../../components/MovieImagePreview/ImagePreview";
import StarRatings from "react-star-ratings";
import {errorImage} from "../../constants/errorImagePath";
import GenresBadgeSet from "../../components/GenresBadgeSet/GenresBadgeSet";
import BackButton from "../../components/BackButton/BackButton";

const TVShowInfo: FC = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const isMovie = ['/movies', '/movie_info'].includes(location.pathname);
    const {chosenTVShow} = useAppSelector((state) => state.TVShows);

    // dispatch(setScrollPosition(chosenTVShow?.id || scroll_position))
    const getLanguage = (code: string) =>
        new Intl.DisplayNames(["en"], {type: "language"}).of(code);

    useEffect(() => {
        if (!chosenTVShow) {
            navigate("/movies");
        }
    }, []);

    return (
        <div className={styles.base}>
            {chosenTVShow && (
                <div className={styles.scrollContainer}>
                    <div className={styles.container}>
                        <div className={styles.short_info}>
                            <div className={styles.genresContainer}>
                                <GenresBadgeSet
                                    key={chosenTVShow.id}
                                    genres_ids={chosenTVShow.genre_ids}
                                />
                                <ImagePreview
                                    poster_path={chosenTVShow.backdrop_path}
                                    title={chosenTVShow.original_name}
                                    error_image_path={errorImage.movieImage}
                                />
                            </div>
                            <div className={styles.info}>
                                <div className={styles.backButton}></div>
                                <h1>{chosenTVShow.original_name}</h1>
                                <StarRatings
                                    rating={(chosenTVShow.vote_average * 6) / 10}
                                    starDimension="20px"
                                    starSpacing="2px"
                                    numberOfStars={6}
                                    starRatedColor="#ff5600"
                                    starEmptyColor="#b1b1b1"
                                />
                                <p>Release date: {chosenTVShow.first_air_date}</p>
                                <p>Language: {getLanguage(chosenTVShow.original_language)}</p>
                                {chosenTVShow.adult && (
                                    <p className={styles.adultContentWarning}>
                                        Parental advisory: explicit content
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className={styles.overview}>{chosenTVShow.overview}</p>
                    </div>
                    <div className={styles.backButton} onClick={() => navigate(isMovie ? "/movies" : "/tv_shows")}>
                        <BackButton/>
                    </div>
                </div>

            )}

            {/*<PaginationComponent*/}
            {/*  page={page}*/}
            {/*  totalPages={totalPages}*/}
            {/*  paginationAction={paginationAction}*/}
            {/*/>*/}
        </div>
    );
};

export default TVShowInfo;
