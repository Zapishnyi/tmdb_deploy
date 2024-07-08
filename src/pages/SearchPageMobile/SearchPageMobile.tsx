import React from "react";
import SearchComponent from "../../components/SearchComponent/SearchComponent";
import styles from "./SearPageMobile.module.css";
import { useNavigate } from "react-router-dom";

const SearchPageMobile = () => {
  const navigate = useNavigate();
  console.log(window.location.hash);
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 800 && window.location.hash === "#/search") {
      navigate("/movies");
    }
  });

  return (
    <div className={styles.searchPage}>
      <SearchComponent />
    </div>
  );
};

export default SearchPageMobile;
