import React, {FC, memo} from "react";
import IMovie from "../../models/IMovie";
import StarRatings from "react-star-ratings";
import styles from "./MovieCard.module.css";
import {useAppDispatch} from "../../redux/store";
import {useNavigate} from "react-router-dom";
import ImagePreview from "../MovieImagePreview/ImagePreview";
import {MoviesActions} from "../../redux/Slices/moviesSlice";
import {errorImage} from "../../constants/errorImagePath";
import {PaginationMovieAction} from "../../redux/Slices/paginationMovieSlice";


interface IProps {
    movie: IMovie;
}

const MovieCard: FC<IProps> = memo(({movie}) => {
    console.log('.')
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const movieChoseHandler = () => {
        dispatch(MoviesActions.setChosenMovie(movie));
        navigate("/movie_info");
    };

    const hoverHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        dispatch(PaginationMovieAction.setObserverPosition(Number(e.currentTarget.className.match(/(?<=id_)\d*/))))
    }

    return (
        <div onClick={movieChoseHandler} onMouseEnter={hoverHandler}
             className={[styles.card, 'observed', `id_${movie.id}`].join(' ')}>
            <ImagePreview
                poster_path={movie.poster_path}
                title={movie.title}
                error_image_path={errorImage.poster}
            />
            <div className={styles.stars}>
                <StarRatings
                    rating={(movie.vote_average * 6) / 10 || 0}
                    starDimension="20px"
                    starSpacing="2px"
                    numberOfStars={6}
                    starRatedColor="#ff5600"
                    starEmptyColor="#b1b1b1"
                />
            </div>
            <h4>{movie.title}</h4>
        </div>
    );
})

export default MovieCard;
