import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { MoviesActions } from "../../redux/Slices/moviesSlice";
import MovieListCard from "../../components/MovieListCard/MovieListCard";
import styles from "./MoviesList.module.css";
import PaginationComponent from "../../components/PaginationComponent/PaginationComponent";
import { ThreeCircles } from "react-loader-spinner";
import { setChosenPage } from "../../redux/Slices/chosenPageSlice";

const MoviesList = () => {
  const dispatch = useAppDispatch();
  const { movies, loadingStateMovies } = useAppSelector(
    (state) => state.Movies,
  );

  const { movieSearchName, chosenGenresId, loadingStateGenres } =
    useAppSelector((state) => state.Search);
  const { chosenPage } = useAppSelector((state) => state.ChosenPage);
  const { total_pages } = useAppSelector((state) => state.Pagination);

  const paginationAction = (pageChanged: number) => {
    dispatch(setChosenPage(pageChanged));
  };

  useEffect(() => {
    dispatch(
      movieSearchName
        ? MoviesActions.searchMoviesByTitle(
            `?query=${movieSearchName}&page=${chosenPage}`,
          )
        : MoviesActions.searchMoviesByGenresOnly(
            `?page=${chosenPage}&with_genres=${chosenGenresId.join()}`,
          ),
    );
  }, [movieSearchName, chosenPage, chosenGenresId]);

  return (
    <div className={styles.moviesListBase}>
      {loadingStateMovies || loadingStateGenres ? (
        <div className={styles.spinner}>
          <ThreeCircles
            height="80"
            width="80"
            color="#9d9deb"
            ariaLabel="loading"
          />
        </div>
      ) : (
        <div className={styles.movieListContainer}>
          {movies.length ? (
            chosenPage <= 500 ? (
              movies.map((movie) => (
                <MovieListCard key={movie.id} movie={movie} />
              ))
            ) : (
              <div className={styles.movieNotFoundWarning}>
                <h3>
                  Database limits showed pages by 500, you should make your
                  request more specific.
                </h3>
              </div>
            )
          ) : (
            <div className={styles.movieNotFoundWarning}>
              <h3>
                Your search request doesn't match any movie in TMDB on this
                page.
              </h3>
            </div>
          )}
        </div>
      )}

      <PaginationComponent
        page={chosenPage}
        totalPages={total_pages}
        paginationAction={paginationAction}
      />
    </div>
  );
};

export default MoviesList;
