import React, {useEffect} from "react";
import styles from "./SearPageMobile.module.css";
import {useNavigate} from "react-router-dom";

const SearchPageMobile = () => {
    const navigate = useNavigate();
    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 800 && window.location.hash === "#/search") {
                navigate("/movies");
            }
        });
        return window.removeEventListener("resize", () => {
        })
    }, []);


    return (
        <div className={styles.searchPage}>
            {/*<SearchComponent/>*/}
        </div>
    );
};

export default SearchPageMobile;
