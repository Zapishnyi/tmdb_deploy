import React, {FC, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../../redux/store";
import styles from "./MovieInfo.module.css";
import ImagePreview from "../../components/MovieImagePreview/ImagePreview";
import StarRatings from "react-star-ratings";
import {errorImage} from "../../constants/errorImagePath";
import GenresBadgeSet from "../../components/GenresBadgeSet/GenresBadgeSet";
import BackButton from "../../components/BackButton/BackButton";

const MovieInfo: FC = () => {
    const navigate = useNavigate();

    const {chosenMovie} = useAppSelector((state) => state.Movies);

    // dispatch(setScrollPosition(chosenMovie?.id || scroll_position))
    const getLanguage = (code: string) =>
        new Intl.DisplayNames(["en"], {type: "language"}).of(code);

    useEffect(() => {
        if (!chosenMovie) {
            navigate("/movies");
        }
    }, []);

    return (
        <div className={styles.base}>
            {chosenMovie && (
                <div className={styles.scrollContainer}>
                    <div className={styles.container}>
                        <div className={styles.short_info}>
                            <div className={styles.genresContainer}>
                                <GenresBadgeSet
                                    key={chosenMovie.id}
                                    genres_ids={chosenMovie.genre_ids}
                                />
                                <ImagePreview
                                    poster_path={chosenMovie.backdrop_path}
                                    title={chosenMovie.original_title}
                                    error_image_path={errorImage.movieImage}
                                />
                            </div>
                            <div className={styles.info}>
                                <div className={styles.backButton}></div>
                                <h1>{chosenMovie.title}</h1>
                                <StarRatings
                                    rating={(chosenMovie.vote_average * 6) / 10}
                                    starDimension="20px"
                                    starSpacing="2px"
                                    numberOfStars={6}
                                    starRatedColor="#ff5600"
                                    starEmptyColor="#b1b1b1"
                                />
                                <p>Release date: {chosenMovie.release_date}</p>
                                <p>Language: {getLanguage(chosenMovie.original_language)}</p>
                                {chosenMovie.adult && (
                                    <p className={styles.adultContentWarning}>
                                        Parental advisory: explicit content
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className={styles.overview}>{chosenMovie.overview}</p>
                    </div>
                    <div className={styles.backButton}>
                        <BackButton to={"/movies"}/>
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

export default MovieInfo;
