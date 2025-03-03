import { useEffect, useLayoutEffect, useRef } from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import { MoviesActions } from "../../redux/Slices/moviesSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import styles from "./MoviesList.module.css";

import { debounce } from "lodash";

import ProgressBar from "../../components/ProgressBar/ProgressBar";

import { CloseSearchPanel } from "../../helpers/CloseSearchPanel";
import { setChosenPageMovie } from "../../redux/Slices/chosenPageSlice";
import { PaginationMovieAction } from "../../redux/Slices/paginationMovieSlice";
import { FadeLoader } from "react-spinners";

const MoviesList = () => {
  // console.log(".");

  const dispatch = useAppDispatch();
  const { moviesFiltered, loadingStateMovies } = useAppSelector(
    (state) => state.Movies
  );
  const { searchNameMovie, chosenGenresMoviesId, loadingStateGenres } =
    useAppSelector((state) => state.Search);
  const { chosenPageMovie } = useAppSelector((state) => state.ChosenPage);
  const { paginationFiltered, observer_position, scroll_position } =
    useAppSelector((state) => state.PaginationMovies);
  const { language } = useAppSelector((state) => state.Language);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const movieListContainerRef = useRef<Element | null>(null);

  // Add page function upon scroll down
  const pageChangeInit = () => {
    if (
      !!moviesFiltered.length &&
      !searchNameMovie &&
      movieListContainerRef.current &&
      movieListContainerRef.current.scrollTop >
        movieListContainerRef.current.scrollHeight - 1500
    ) {
      dispatch(setChosenPageMovie(chosenPageMovie + 1));
    }
  };

  // function to add elements to observer upon scroll
  const observeElements = () => {
    const observedElements = Array.from(
      document.getElementsByClassName("observed")
    );
    observedElements.forEach((element) =>
      observerRef.current?.observe(element)
    );
  };

  // function to handle ne intersecting elements
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        dispatch(
          PaginationMovieAction.setObserverPosition(
            Number(entry.target.className.match(/(?<=id_)\d*/))
          )
        );
      }
    });
  };

  const scrollHandle = debounce(() => {
    observeElements();
    pageChangeInit();
  }, 100);

  useEffect(() => {
    if (loadingStateMovies) return;
    movieListContainerRef.current = document.getElementsByClassName(
      styles.movieListContainer
    )[0];
    // observeElements();
    movieListContainerRef.current?.addEventListener("scroll", scrollHandle);

    const observeOption: IntersectionObserverInit = {
      root: document.getElementsByClassName(
        styles.moviesListBase
      )[0] as HTMLDivElement,
      rootMargin: "0px",
      threshold: 0.5,
    };

    // Create the IntersectionObserver instance only once
    observerRef.current = new IntersectionObserver(
      handleIntersection,
      observeOption
    );
    if (scroll_position === 0) {
      movieListContainerRef.current?.scrollTo(0, scroll_position);
    }
    return () => {
      movieListContainerRef.current?.removeEventListener(
        "scroll",
        scrollHandle
      );
      observerRef.current?.disconnect();
    };
  }, [moviesFiltered]);

  useEffect(() => {
    dispatch(
      PaginationMovieAction.setScrollPosition(
        movieListContainerRef.current?.scrollTop
      )
    );
    dispatch(
      MoviesActions.searchMovies({
        searchByTitle: !!searchNameMovie,
        query: `?page=${chosenPageMovie}&${
          searchNameMovie
            ? `query=${searchNameMovie}`
            : `with_genres=${chosenGenresMoviesId.join()}`
        }&language=${language}`,
      })
    );
  }, [searchNameMovie, chosenGenresMoviesId, chosenPageMovie, language]);

  useLayoutEffect(() => {
    // scroll to previous position upon return to the page
    movieListContainerRef.current = document.getElementsByClassName(
      styles.movieListContainer
    )[0];

    movieListContainerRef.current?.scrollTo(0, scroll_position);
    return () => {
      dispatch(
        PaginationMovieAction.setScrollPosition(
          movieListContainerRef.current?.scrollTop
        )
      );
    };
  }, []);

  return (
    <div className={styles.moviesListBase} onClick={CloseSearchPanel}>
      {paginationFiltered.total_results > 1 && (
        <ProgressBar observerPosition={observer_position} />
      )}
      {(loadingStateMovies || loadingStateGenres) && !moviesFiltered.length ? (
        <div className={styles.spinner}>
          <FadeLoader color="#9d9deb" />
        </div>
      ) : (
        <div className={styles.movieListContainer}>
          {moviesFiltered.length ? (
            moviesFiltered.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))
          ) : (
            <div className={styles.movieNotFoundWarning}>
              <h3>Your search request doesn't match any movie in TMDB.</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoviesList;
