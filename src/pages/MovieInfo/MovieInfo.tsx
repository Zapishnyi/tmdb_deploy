import React, {FC, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import styles from "./MovieInfo.module.css";
import MovieImagePreview from "../../components/MovieImagePreview/MovieImagePreview";
import StarRatings from "react-star-ratings";
import {errorImage} from "../../constants/errorImagePath";
import GenresBadgeSet from "../../components/GenresBadgeSet/GenresBadgeSet";
import BackButton from "../../components/BackButton/BackButton";
import PaginationComponent from "../../components/PaginationComponent/PaginationComponent";
import {MoviesActions} from "../../redux/Slices/moviesSlice";
import {setScrollPosition} from "../../redux/Slices/paginationSlice";

const MovieInfo: FC = () => {
    const navigate = useNavigate();

    const {chosenMovie} = useAppSelector((state) => state.Movies);
    const {scroll_position} = useAppSelector((state) => state.Pagination);

    const dispatch = useAppDispatch();
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
                                <MovieImagePreview
                                    poster_path={chosenMovie.backdrop_path}
                                    title={chosenMovie.title}
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
                    <div className={styles.backButton} onClick={() => navigate("/movies")}>
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

export default MovieInfo;
