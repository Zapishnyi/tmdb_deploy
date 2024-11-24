import React, {FC, useEffect, useRef, lazy, Suspense} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {MoviesActions} from "../../redux/Slices/moviesSlice";
import MovieCard from "../../components/MovieCard/MovieCard";
import styles from "./MoviesList.module.css";

import {debounce} from "lodash";


import {ThreeCircles} from "react-loader-spinner";
import {moviesFiltering} from "../../helpers/MovieFilter";
import {setChosenPageMovie} from "../../redux/Slices/chosenPageSlice";
import {PaginationMovieAction} from "../../redux/Slices/paginationMovieSlice";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import {LanguageEnum} from "../../enums/languageEnum";


const MoviesList: FC = () => {

    const dispatch = useAppDispatch();

    const {moviesDownloaded, moviesFiltered, loadingStateMovies} = useAppSelector((state) => state.Movies);
    const {
        searchNameMovie,
        genresMovies,
        chosenGenresMoviesId,
        loadingStateGenres
    } = useAppSelector((state) => state.Search);
    const {chosenPageMovie} = useAppSelector((state) => state.ChosenPage);
    const {
        paginationDownloaded,
        paginationFiltered,
        observer_position,
        scroll_position,
    } = useAppSelector((state) => state.PaginationMovies);
    const {language} = useAppSelector(state => state.Language)
    // console.log('.', observer_position, "paginationFiltered:", paginationFiltered, "paginationDownloaded:", paginationDownloaded)

    const observerRef = useRef<IntersectionObserver | null>(null);
    const movieListContainerRef = useRef<Element | null>(null);
    const searchNameMovieRef = useRef<string>('');
    const chosenGenresMoviesIdRef = useRef<number[]>([]);
    const chosenPageRef = useRef<number>(1);
    const languageRef = useRef<LanguageEnum>(LanguageEnum.US);
    const pageChangeInit = () => {
        if (movieListContainerRef.current && movieListContainerRef.current.scrollTop > movieListContainerRef.current.scrollHeight - 1500 && chosenPageMovie !== paginationFiltered.total_pages) {
            dispatch(setChosenPageMovie(chosenPageMovie + 1))
        }
    }

    const observeElements = () => {
        const observedElements = Array.from(document.getElementsByClassName('observed'));
        observedElements.forEach(element => observerRef.current?.observe(element));
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dispatch(PaginationMovieAction.setObserverPosition(Number(entry.target.className.match(/(?<=id_)\d*/))))
                dispatch(PaginationMovieAction.setScrollPosition(movieListContainerRef.current?.scrollTop))
            }
        });
    }

    const scrollHandle = debounce(() => {
        observeElements()
        pageChangeInit()
    }, 100)

    useEffect(() => {
        // console.log("use Effect 1 fired: eventListener for scroll")
        if (loadingStateMovies) return;
        movieListContainerRef.current = document.getElementsByClassName(styles.movieListContainer)[0]
        // observeElements()
        movieListContainerRef.current?.addEventListener('scroll', scrollHandle)
        return () => {
            movieListContainerRef.current?.removeEventListener('scroll', scrollHandle)
            observerRef.current?.disconnect();
        };

    }, [moviesFiltered]);

    useEffect(() => {
        // console.log("use Effect 2 fired: RefVariables, position scroll to position observer, list to observe register")
        searchNameMovieRef.current = searchNameMovie;
        chosenGenresMoviesIdRef.current = chosenGenresMoviesId;
        chosenPageRef.current = chosenPageMovie;
        languageRef.current = language;

        const observeOption: IntersectionObserverInit = {
            root: document.getElementsByClassName(styles.moviesListBase)[0] as HTMLDivElement,
            rootMargin: '0px',
            threshold: 0.5,
        };

        // Create the IntersectionObserver instance only once
        observerRef.current = new IntersectionObserver(handleIntersection, observeOption);
        pageChangeInit()

        // scroll to previous position upon return to the page
        movieListContainerRef.current?.scrollTo(0, scroll_position);
        // console.log("scroll_position:", scroll_position, movieListContainerRef.current)
        return () => observerRef.current?.disconnect();
    }, []);

    console.log('scroll_position', observer_position)
    useEffect(() => {
        // console.log("use Effect 3 fired: movie download logic")
        if (loadingStateMovies) return; // Prevents reloading if data is already loading
        // console.log('searchNameMovieRef.current', searchNameMovieRef.current)
        // console.log('searchNameMovie', searchNameMovie)
        switch (true) {
            case !moviesFiltered.length && !moviesDownloaded.length && !searchNameMovie: {
                // console.log("1: movies empty / no title", chosenPageMovie)

                dispatch(
                    MoviesActions.searchMovies({
                        searchByTitle: !!
                            searchNameMovie,
                        query: `?page=${chosenPageMovie}&with_genres=${chosenGenresMoviesId.join()}&language=${language}`,
                    })
                )
            }
                break;
            case !searchNameMovie && languageRef.current !== language : {
                // console.log("1: movies empty / no title", chosenPageMovie)
                movieListContainerRef.current?.scrollTo(0, 0)
                dispatch(
                    MoviesActions.searchMovies({
                        searchByTitle: !!
                            searchNameMovie,
                        query: `?page=${1}&with_genres=${chosenGenresMoviesId.join()}&language=${language}`,
                    })
                )

            }
                break;

            case  searchNameMovieRef.current !== searchNameMovie : {
                // console.log("2: title search > title changed")
                dispatch(MoviesActions.searchMovies({
                    searchByTitle: !!searchNameMovie,
                    query: `?query=${searchNameMovie}&page=${chosenPageMovie}&language=${language}`
                }))
            }
                break;
            case   searchNameMovie && languageRef.current !== language : {
          
                dispatch(MoviesActions.searchMovies({
                    searchByTitle: !!searchNameMovie,
                    query: `?query=${searchNameMovie}&page=${chosenPageMovie}&language=${language}`
                }))
            }
                break;
            case  JSON.stringify(chosenGenresMoviesIdRef.current) !== JSON.stringify(chosenGenresMoviesId) : {
                // console.log(" chosenGenresMoviesIdRef.current:", chosenGenresMoviesIdRef.current,)
                // console.log(" chosenGenresMoviesId:", chosenGenresMoviesId,)
                if (!!searchNameMovie) {
                    // console.log("3: genres changed > with title")
                    // console.log("filtered", moviesDownloaded)
                    const filtered = moviesFiltering(moviesDownloaded);

                    dispatch(MoviesActions.setMoviesFiltered(filtered.results || []));
                    dispatch(PaginationMovieAction.setPaginationFiltered(filtered));

                } else {
                    // console.log("4:3: genres changed > without title")
                    dispatch(
                        MoviesActions.searchMovies({
                            searchByTitle: !!searchNameMovie,
                            query: `?page=${chosenPageMovie}&with_genres=${chosenGenresMoviesId.join()}&language=${language}`,
                        })
                    )
                }
            }
                break;
            case chosenPageRef.current !== chosenPageMovie : {

                // console.log("5: page changed for endless pagination", chosenPageRef.current, chosenPageMovie)
                if (!(!!searchNameMovie)) {
                    dispatch(
                        MoviesActions.endlessPaginationAction({
                            searchByTitle: !!
                                searchNameMovie,
                            query: `?page=${chosenPageMovie}&with_genres=${chosenGenresMoviesId.join()}&language=${language}`,
                        })
                    )
                }
                break;
            }
        }

        searchNameMovieRef.current = searchNameMovie;
        chosenGenresMoviesIdRef.current = chosenGenresMoviesId;
        chosenPageRef.current = chosenPageMovie;
        languageRef.current = language
    }, [searchNameMovie, chosenGenresMoviesId, chosenPageMovie, language]);

    useEffect(() => {
        // console.log("use Effect 4 fired: dovnloaded movie changed")
        if (loadingStateMovies) return;
        if (!!searchNameMovie) {
            // console.log("1: with title")
            const moviesFilter = moviesFiltering(moviesDownloaded)
            // console.log("movies filtered before update", {...moviesFilter})
            dispatch(MoviesActions.setMoviesFiltered(moviesFilter.results))
            dispatch(PaginationMovieAction.setPaginationFiltered(moviesFilter))
            // console.log('movies Filtered after update', {...moviesFiltered})
        } else {
            // console.log("2: without title")
            dispatch(MoviesActions.setMoviesFiltered(moviesDownloaded))
            dispatch(PaginationMovieAction.setPaginationFiltered(paginationDownloaded))
        }

    }, [moviesDownloaded]);

    // console.log("scroll_position:", scroll_position,)
    // console.log("moviesFiltered", moviesFiltered.length)
    const LazyComponent = lazy(() => import(styles.movieListContainer));
    return (
        <div className={styles.moviesListBase}>
            {paginationFiltered.total_results > 1 && <ProgressBar observerPosition={observer_position}/>}
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
                    {moviesFiltered.length ? (
                        // chosenPage <= 500 ? (
                        moviesFiltered.map((movie, index) => (
                            <MovieCard key={index} movie={movie}/>
                        ))
                        // )
                        // ) : (
                        //     <div className={styles.movieNotFoundWarning}>
                        //         <h3>
                        //             Database limits showed pages by 500, you should make your
                        //             request more specific.
                        //         </h3>
                        //     </div>
                        // )
                    ) : (
                        <div className={styles.movieNotFoundWarning}>
                            <h3>
                                Your search request doesn't match any movie in TMDB.
                            </h3>
                        </div>
                    )}
                </div>
            )}


        </div>
    );
}

export default MoviesList;
