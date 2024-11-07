import React, {FC, useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {MoviesActions} from "../../redux/Slices/moviesSlice";
import MovieListCard from "../../components/MovieListCard/MovieListCard";
import styles from "./MoviesList.module.css";
import {setChosenPage} from "../../redux/Slices/chosenPageSlice";
import {debounce} from "lodash";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import {setObserverPosition, setPaginationFiltered, setScrollPosition} from "../../redux/Slices/paginationSlice";
import {ThreeCircles} from "react-loader-spinner";
import {moviesFiltering} from "../../helpers/MovieFilter";


const MoviesList: FC = () => {

    const dispatch = useAppDispatch();

    const {moviesDownloaded, moviesFiltered, loadingStateMovies} = useAppSelector((state) => state.Movies);
    const {movieSearchName, chosenGenresId, loadingStateGenres} = useAppSelector((state) => state.Search);
    const {chosenPage} = useAppSelector((state) => state.ChosenPage);
    const {
        paginationDownloaded,
        paginationFiltered,
        observer_position,
        scroll_position,
    } = useAppSelector((state) => state.Pagination);
    console.log('.', observer_position, "paginationFiltered:", paginationFiltered, "paginationDownloaded:", paginationDownloaded)

    const observerRef = useRef<IntersectionObserver | null>(null);
    const movieListContainerRef = useRef<Element | null>(null);
    const movieSearchNameRef = useRef<string>('');
    const chosenGenresIdRef = useRef<number[]>([]);
    const chosenPageRef = useRef<number>(1);
    const pageChangeInit = () => {
        if (movieListContainerRef.current && movieListContainerRef.current.scrollTop > movieListContainerRef.current.scrollHeight - 1500 && chosenPage !== paginationFiltered.total_pages) {
            dispatch(setChosenPage(chosenPage + 1))
        }
    }

    const observeElements = () => {
        const observedElements = Array.from(document.getElementsByClassName('observed'));
        observedElements.forEach(element => observerRef.current?.observe(element));
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dispatch(setObserverPosition(Number(entry.target.className.match(/(?<=id_)\d*/))))
                dispatch(setScrollPosition(movieListContainerRef.current?.scrollTop))
            }
        });
    }

    const scrollHandle = debounce(() => {
        observeElements()
        pageChangeInit()
    }, 100)

    useEffect(() => {
        console.log("use Effect 1 fired: adeventlidtener for scroll")
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
        console.log("use Effect 2 fired: RefVariables, position scroll to position obcerver, list to observe register")
        movieSearchNameRef.current = movieSearchName;
        chosenGenresIdRef.current = chosenGenresId;
        chosenPageRef.current = chosenPage;

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
        console.log("scroll_position:", scroll_position, movieListContainerRef.current)
        return () => observerRef.current?.disconnect();
    }, []);


    useEffect(() => {
        console.log("use Effect 3 fired: movie download logic")
        if (loadingStateMovies) return; // Prevents reloading if data is already loading
        console.log('movieSearchNameRef.current', movieSearchNameRef.current)
        console.log('movieSearchName', movieSearchName)
        switch (true) {
            case !moviesFiltered.length && !moviesDownloaded.length && !movieSearchName : {
                console.log("1: movies empty / no title", chosenPage)

                dispatch(
                    MoviesActions.searchMovies({
                        searchByTitle: !!
                            movieSearchName, query: `?page=${chosenPage}&with_genres=${chosenGenresId.join()}`,
                    })
                )
            }
                break;

            case  movieSearchNameRef.current !== movieSearchName : {
                console.log("2: title search > title changed")
                dispatch(MoviesActions.searchMovies({
                    searchByTitle: !!movieSearchName, query: `?query=${movieSearchName}&page=${chosenPage}`
                }))
            }
                break;
            case  JSON.stringify(chosenGenresIdRef.current) !== JSON.stringify(chosenGenresId) : {
                console.log(" chosenGenresIdRef.current:", chosenGenresIdRef.current,)
                console.log(" chosenGenresId:", chosenGenresId,)
                if (!!movieSearchName) {
                    console.log("3: genres changed > with title")
                    console.log("filtered", moviesDownloaded)
                    const filtered = moviesFiltering(moviesDownloaded);

                    dispatch(MoviesActions.setMoviesFiltered(filtered.results));
                    dispatch(setPaginationFiltered(filtered));

                } else {
                    console.log("4:3: genres changed > without title")
                    dispatch(
                        MoviesActions.searchMovies({
                            searchByTitle: !!movieSearchName,
                            query: `?page=${chosenPage}&with_genres=${chosenGenresId.join()}`,
                        })
                    )
                }
            }
                break;
            case chosenPageRef.current !== chosenPage : {

                console.log("5: page changed for endless pagination", chosenPageRef.current, chosenPage)
                if (!(!!movieSearchName)) {
                    dispatch(
                        MoviesActions.endlessPaginationAction({
                            searchByTitle: !!
                                movieSearchName, query: `?page=${chosenPage}&with_genres=${chosenGenresId.join()}`,
                        })
                    )
                }
                break;
            }
        }

        movieSearchNameRef.current = movieSearchName;
        chosenGenresIdRef.current = chosenGenresId;
        chosenPageRef.current = chosenPage;
    }, [movieSearchName, chosenGenresId, chosenPage]);

    useEffect(() => {
        console.log("use Effect 4 fired: dovnloaded movie changed")
        if (loadingStateMovies) return;
        if (!!movieSearchName) {
            console.log("1: with title")
            const moviesFilter = moviesFiltering(moviesDownloaded)
            console.log("movies filtered before update", {...moviesFilter})
            dispatch(MoviesActions.setMoviesFiltered(moviesFilter.results))
            dispatch(setPaginationFiltered(moviesFilter))
            console.log('movies Filtered after update', {...moviesFiltered})
        } else {
            console.log("2: without title")
            dispatch(MoviesActions.setMoviesFiltered(moviesDownloaded))
            dispatch(setPaginationFiltered(paginationDownloaded))
        }

    }, [moviesDownloaded]);

    console.log("scroll_position:", scroll_position,)
    console.log("moviesFiltered", moviesFiltered.length)

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
                            <MovieListCard key={index} movie={movie}/>
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
