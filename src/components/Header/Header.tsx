import React, {FC, useEffect} from "react";
import {useAppDispatch} from "../../redux/store";
import SearchComponent from "../SearchComponent/SearchComponent";
import UserInfo from "../UserInfo/UserInfo";
import ColorThemeToggle from "../ColorThemeToggle/ColorThemeToggle";
import SearchMenuButtonMobile from "../SearchMenuButtonMobile/SearchMenuButtonMobile";
import styles from "./Header.module.css";
import {Link, useLocation} from "react-router-dom";
import {SearchActions} from "../../redux/Slices/searchSlice";
import './Header.css'

const Header: FC = () => {
    // const {chosenGenresId} = useAppSelector((state) => state.Search);
    const dispatch = useAppDispatch();
    const location = useLocation()
    const isMovie = ['/movies', '/movie_info'].includes(location.pathname);
    const underline = document.getElementsByClassName(styles.underline)[0] as HTMLDivElement;
    isMovie ? underline?.classList.remove(styles.right) : underline?.classList.add(styles.right)

    useEffect(() => {
        dispatch(SearchActions.loadMovieGenres());
        dispatch(SearchActions.loadTVShowsGenres());
    }, []);

    return (
        <div className={styles.header} id={"header"}>
            <div className={styles.container}>
                <Link to={"/movies"} className={styles.logo}>
                    <img src={require("../../assets/images/TMDB_logo2.png")} alt="Logo"/>
                </Link>
                <div className={styles.menu_wrapper}>
                    <ul>
                        <li>
                            <Link to={"/movies"}>
                                <p>Movies</p>
                            </Link>
                        </li>
                        <li>
                            <Link to={"/tv_shows"}>
                                <p>TV Shows</p>
                            </Link>
                        </li>


                    </ul>
                    <div className={styles.underline}></div>
                </div>
                <div className={styles.themeUserContainer}>
                    <SearchMenuButtonMobile style={styles.searchComponent}/>
                    <ColorThemeToggle/>
                    <UserInfo/>
                </div>
                <div className={styles.searchComponent}>
                    <SearchComponent style={styles.searchComponent}/>
                </div>
            </div>
            {/*<div className={styles.badgesContainerMobile}>*/}
            {/*    <GenresBadgeSet genres_ids={chosenGenresId}/>*/}
            {/*</div>*/}
        </div>
    );
};

export default Header;
