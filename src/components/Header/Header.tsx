import React, {FC, useEffect} from "react";
import {useAppDispatch} from "../../redux/store";
import SearchComponent from "../SearchComponent/SearchComponent";
import UserInfo from "../UserInfo/UserInfo";
import SearchMenuOpenBtn from "../SearchMenuOpenBtn/SearchMenuOpenBtn";
import styles from "./Header.module.css";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {SearchActions} from "../../redux/Slices/searchSlice";
import './Header.css'
import SearchMenuCloseBtn from "../SearchMenuCloseBtn/SearchMenuCloseBtn";
import ViewTransitionHandle from "../../helpers/ViewTransitionHandle";


const Header: FC = () => {
    // const {chosenGenresId} = useAppSelector((state) => state.Search);
    const dispatch = useAppDispatch();
    const location = useLocation()
    const isMovie = ['/movies', '/movie_info'].includes(location.pathname);
    const underline = document.getElementsByClassName(styles.underline)[0] as HTMLDivElement;
    isMovie ? underline?.classList.remove(styles.right) : underline?.classList.add(styles.right)
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(SearchActions.loadMovieGenres());
        dispatch(SearchActions.loadTVShowsGenres());
    }, []);

    return (
        <div className={styles.header} id={"header"}>
            <div className={styles.container}>
                <div onClick={() => ViewTransitionHandle("/movies", navigate)} className={styles.logo}>
                    <img src={require("../../assets/images/TMDB_logo2.png")} alt="Logo"/>
                </div>
                <div className={styles.menu_wrapper}>
                    <ul>
                        <li>
                            <p onClick={() => ViewTransitionHandle("/movies", navigate)}>Movies</p>

                        </li>
                        <li>

                            <p onClick={() => ViewTransitionHandle("/tv_shows", navigate)}>TV Shows</p>

                        </li>


                    </ul>
                    <div className={styles.underline}></div>
                </div>
                <div className={styles.instruments}>
                    <div className={[styles.searchButton, 'searchButton'].join(' ')}>
                        <SearchMenuOpenBtn/>
                        <SearchMenuCloseBtn/>
                    </div>
                    <div className={styles.themeUserContainer}>


                        <UserInfo/>
                    </div>
                </div>
                <div className={[styles.searchComponent, 'search'].join(' ')}>
                    <SearchComponent/>
                </div>
            </div>
            {/*<div className={styles.badgesContainerMobile}>*/}
            {/*    <GenresBadgeSet genres_ids={chosenGenresId}/>*/}
            {/*</div>*/}
        </div>
    );
};

export default Header;
