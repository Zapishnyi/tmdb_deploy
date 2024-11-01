import React, {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {MoviesActions} from "../../redux/Slices/moviesSlice";
import MovieListCard from "../../components/MovieListCard/MovieListCard";
import styles from "./MoviesList.module.css";
import {setChosenPage} from "../../redux/Slices/chosenPageSlice";
import {debounce} from "lodash";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import {setObserverPosition, setScrollPosition} from "../../redux/Slices/paginationSlice";

const observeOption: IntersectionObserverInit = {
    root: document.querySelector(styles.movieListContainer),
    rootMargin: "0px",
    threshold: 1.0,
};
const MoviesList = () => {
    console.log('.')
    const dispatch = useAppDispatch();
    const {movies, loadingStateMovies} = useAppSelector(
        (state) => state.Movies,
    );
    const observerRef = useRef<IntersectionObserver | null>(null);
    const movieListContainerRef = useRef<Element | null>(null);


    const {movieSearchName, chosenGenresId} =
        useAppSelector((state) => state.Search);
    const {chosenPage} = useAppSelector((state) => state.ChosenPage);

    const {total_pages, observer_position, scroll_position, page} = useAppSelector((state) => state.Pagination);

    useEffect(() => {
        if (loadingStateMovies) return; // Prevents reloading if data is already loading
        if (chosenPage !== page || page === 1) {

            dispatch(chosenPage === 1 ?
                MoviesActions.searchMovies({
                    searchByTitle: !!movieSearchName, query: movieSearchName ?
                        `?query=${movieSearchName}&page=${chosenPage}` : `?page=${chosenPage}&with_genres=${chosenGenresId.join()}`,
                }) : MoviesActions.endlessPaginationAction({
                    searchByTitle: !!
                        movieSearchName, query: movieSearchName ?
                        `?query=${movieSearchName}&page=${chosenPage}` : `?page=${chosenPage}&with_genres=${chosenGenresId.join()}`,
                })
            )
        }
    }, [movieSearchName, chosenGenresId, chosenPage]);


    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dispatch(setObserverPosition(Number(entry.target.className.match(/(?<=id_)\d*/))))
                dispatch(setScrollPosition(movieListContainerRef.current?.scrollTop))
            }
        });
    }

    useEffect(() => {
        // Create the IntersectionObserver instance only once
        observerRef.current = new IntersectionObserver(handleIntersection, observeOption);
        return () => observerRef.current?.disconnect();
    }, [handleIntersection]);

    const observeElements = () => {
        const observedElements = Array.from(document.getElementsByClassName('observed'));
        observedElements.forEach(element => observerRef.current?.observe(element));
    }
    console.log("movies", movies.length)
    const scrollHandle = debounce(() => {
        observeElements()
        if (movieListContainerRef.current) {
            if (movieListContainerRef.current.scrollTop > movieListContainerRef.current.scrollHeight - 1500 && chosenPage !== total_pages) {
                dispatch(setChosenPage(chosenPage + 1))

            }


        }
    }, 100)
    useEffect(() => {
        if (loadingStateMovies) return;
        movieListContainerRef.current = document.getElementsByClassName(styles.movieListContainer)[0]


        observeElements()
        // const observedElements = document.querySelectorAll('.observed')

        movieListContainerRef.current.addEventListener('scroll', scrollHandle)
        return () => {
            movieListContainerRef.current?.removeEventListener('scroll', scrollHandle)
            observerRef.current?.disconnect();
        };
    }, [movies]);

    // useEffect(() => {
    //     // Save the scroll position before leaving the page
    //     return () => {
    //         const base = movieListContainerRef.current
    //         console.log("unmount", base?.scrollTop)
    //         dispatch(setScrollPosition(base?.scrollTop));
    //     };
    // }, []);

    useEffect(() => {
        // Restore the scroll position when coming back
        console.log("mount", scroll_position)
        movieListContainerRef.current?.scrollTo(0, scroll_position);

    }, []);
    return (
        <div className={styles.moviesListBase}>
            <ProgressBar observerPosition={observer_position}/>
            {/*{loadingStateMovies || loadingStateGenres ? (*/}
            {/*    <div className={styles.spinner}>*/}
            {/*        <ThreeCircles*/}
            {/*            height="80"*/}
            {/*            width="80"*/}
            {/*            color="#9d9deb"*/}
            {/*            ariaLabel="loading"*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*) : (*/}
            <div className={styles.movieListContainer}>
                {/*movies.length ? (*/
                    // chosenPage <= 500 ? (
                    movies.map((movie, index) => (
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
                    // ) : (
                    //     <div className={styles.movieNotFoundWarning}>
                    //         <h3>
                    //             Your search request doesn't match any movie in TMDB on this
                    //             page.
                    //         </h3>
                    //     </div>
                    // )}
                }
            </div>
            {/*)}*/}


        </div>
    );
}

export default MoviesList;
