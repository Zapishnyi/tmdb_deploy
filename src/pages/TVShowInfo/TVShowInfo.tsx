import React, {FC, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../redux/store";
import styles from "./TVShowInfo.module.css";
import ImagePreview from "../../components/MovieImagePreview/ImagePreview";
import StarRatings from "react-star-ratings";
import {errorImage} from "../../constants/errorImagePath";
import GenresBadgeSet from "../../components/GenresBadgeSet/GenresBadgeSet";
import BackButton from "../../components/BackButton/BackButton";
import {get} from "../../services/getTMDBData.api.service";
import {AxiosError} from "axios";
import IErrorResponse from "../../models/IErrorResponse";
import ITVShowDetails from "../../models/ITVShowDetails";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import AvatarIcon from "../../components/AvatarIcon/AvatarIcon";
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';
import {urlImage} from "../../constants/tmdbURLS";
import Season from "../../components/Season/Season";

const TVShowInfo: FC = () => {
    const location = useLocation()
    const isMovie = ['/movies', '/movie_info'].includes(location.pathname);
    const {chosenTVShow} = useAppSelector((state) => state.TVShows);
    const {language} = useAppSelector(state => state.Language)


    // dispatch(setScrollPosition(tvShow?.id || scroll_position))
    const getLanguage = (code: string) =>
        new Intl.DisplayNames(["en"], {type: "language"}).of(code);
    const [tvShow, setTVShow] = useState<ITVShowDetails | null>(null)
    useEffect(() => {
        try {
            if (chosenTVShow) {
                get.tvShow.byId(chosenTVShow.id, `language=${language}`).then(value => {
                        setTVShow(value);
                        console.log("TVSHOW:", value)
                    }
                )

            }

        } catch (e) {
            const error = e as AxiosError<IErrorResponse>;
            console.log(error)
        }
        // if (!tvShow) {
        //     navigate("/tv_shows");
        // }
    }, [language]);


    return (
        <div className={styles.base}>
            {tvShow && (
                <div className={styles.scrollContainer}>
                    <div className={styles.container}>
                        <div className={styles.short_info}>
                            <div className={styles.genresContainer}>
                                <GenresBadgeSet
                                    key={tvShow.id}
                                    genres_ids={tvShow.genres.map((e) => (e.id))}
                                />
                                <ImagePreview
                                    poster_path={tvShow.backdrop_path}
                                    title={tvShow.name}
                                    error_image_path={errorImage.movieImage}
                                />
                            </div>
                            <div className={styles.info}>
                                <div className={styles.backButton}></div>
                                <h1>{tvShow.original_name}</h1>
                                <StarRatings
                                    rating={(tvShow.vote_average * 6) / 10}
                                    starDimension="20px"
                                    starSpacing="2px"
                                    numberOfStars={6}
                                    starRatedColor="#ff5600"
                                    starEmptyColor="#b1b1b1"
                                />

                                <p>Seasons: {tvShow.seasons[tvShow.seasons.length - 1].season_number} {tvShow.in_production &&
                                    <span> - in production...</span>}</p>
                                <p>Release date: {tvShow.first_air_date}</p>
                                <p>Language: {getLanguage(tvShow.original_language)}</p>
                                <p className={styles.homepage}>
                                    <a href={tvShow.homepage} target="_blan" rel="noopener noreferrer">
                                        Homepage <ArrowRightAltRoundedIcon/>
                                    </a></p>
                                {tvShow.adult && (
                                    <p className={styles.adultContentWarning}>
                                        Parental advisory: explicit content
                                    </p>
                                )}
                            </div>
                        </div>

                        <p className={styles.overview}>{tvShow.overview}</p>
                        <div className={styles.accordion}>
                            {tvShow.networks.length > 0 &&
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        Networks
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className={styles.network}>
                                            {tvShow.networks.map((e, i) => <img key={i} src={urlImage(e.logo_path)}
                                                                                alt={e.name}/>)}
                                        </div>

                                    </AccordionDetails>
                                </Accordion>
                            }
                            {tvShow.created_by.length > 0 &&
                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel2-content"
                                        id="panel2-header"
                                    >
                                        Created by...
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className={styles.avatars}>
                                            {tvShow.created_by.map((e, i) => <AvatarIcon key={i} name={e.name}
                                                                                         iconPath={e.profile_path}/>)
                                            }
                                        </div>

                                    </AccordionDetails>
                                </Accordion>

                            }
                            {tvShow.seasons.length > 0 && tvShow.seasons.map((e) => <Season key={e.id} season={e}/>)}
                        </div>
                        <div className={styles.backButton}>
                            <BackButton to={isMovie ? "/movies" : "/tv_shows"}/>
                        </div>
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
