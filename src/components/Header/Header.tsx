import React, {FC, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import SearchComponent from "../SearchComponent/SearchComponent";
import UserInfo from "../UserInfo/UserInfo";
import ColorThemeToggle from "../ColorThemeToggle/ColorThemeToggle";
import SearchMenuButtonMobile from "../SearchMenuButtonMobile/SearchMenuButtonMobile";
import GenresBadgeSet from "../GenresBadgeSet/GenresBadgeSet";
import styles from "./Header.module.css";
import {Link} from "react-router-dom";
import {SearchActions} from "../../redux/Slices/searchSlice";
import './Header.css'

const Header: FC = () => {
    const {chosenGenresId} = useAppSelector((state) => state.Search);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(SearchActions.loadGenres());
    }, []);

    return (
        <div className={styles.header} id={"header"}>
            <div className={styles.container}>
                <Link to={"/movies"} className={styles.logo}>
                    <img src={require("../../assets/images/TMDB_logo.png")} alt="Logo"/>
                </Link>

                <div className={styles.searchComponent}>
                    <SearchComponent style={styles.searchComponent}/>
                </div>

                <div className={styles.themeUserContainer}>
                    <SearchMenuButtonMobile style={styles.searchComponent}/>
                    <ColorThemeToggle/>
                    <UserInfo/>
                </div>
            </div>
            {/*<div className={styles.badgesContainerMobile}>*/}
            {/*    <GenresBadgeSet genres_ids={chosenGenresId}/>*/}
            {/*</div>*/}
        </div>
    );
};

export default Header;
