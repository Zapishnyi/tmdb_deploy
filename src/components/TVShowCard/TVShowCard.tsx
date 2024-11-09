import React, {FC, memo} from "react";
import StarRatings from "react-star-ratings";
import styles from "./TVShowCard.module.css";
import {useAppDispatch} from "../../redux/store";
import {useNavigate} from "react-router-dom";
import ImagePreview from "../MovieImagePreview/ImagePreview";
import {errorImage} from "../../constants/errorImagePath";

import ITVShow from "../../models/ITVShow";
import {TVShowsActions} from "../../redux/Slices/tvShowsSlice";
import {PaginationTVShowAction} from "../../redux/Slices/paginationTVShowSlice";

interface IProps {
    tvShow: ITVShow;
}

const TVShowCard: FC<IProps> = memo(({tvShow}) => {
    console.log('.')
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const movieChoseHandler = () => {
        dispatch(TVShowsActions.setChosenTVShow(tvShow));
        navigate("/tv_show_info");
    };

    const hoverHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        dispatch(PaginationTVShowAction.setObserverPosition(Number(e.currentTarget.className.match(/(?<=id_)\d*/))))
    }

    return (
        <div onClick={movieChoseHandler} onMouseEnter={hoverHandler}
             className={[styles.card, 'observed', `id_${tvShow.id}`].join(' ')}>
            <ImagePreview
                poster_path={tvShow.poster_path}
                title={tvShow.original_name}
                error_image_path={errorImage.poster}
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
            <h4>{tvShow.original_name}</h4>
        </div>
    );
})

export default TVShowCard;
