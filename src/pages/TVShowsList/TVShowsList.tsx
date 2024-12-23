import React, {FC, useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {MoviesActions} from "../../redux/Slices/moviesSlice";
import styles from "./TVShowsList.module.css";

import {debounce} from "lodash";


import {ThreeCircles} from "react-loader-spinner";
import {setChosenPageTVShow} from "../../redux/Slices/chosenPageSlice";
import {PaginationTVShowAction} from "../../redux/Slices/paginationTVShowSlice";
import {TVShowsActions} from "../../redux/Slices/tvShowsSlice";
import {TVShowFiltering} from "../../helpers/TVShowFilter";
import TVShowCard from "../../components/TVShowCard/TVShowCard";
import ProgressBar from "../../components/ProgressBar/ProgressBar";


const TVShowsList: FC = () => {

    const dispatch = useAppDispatch();

    const {
        chosenTVShow,
        tvShowsDownloaded,
        tvShowsFiltered,
        loadingStateTVShows
    } = useAppSelector((state) => state.TVShows);
    const {searchNameTVShow, chosenGenresTVShowsId, loadingStateGenres} = useAppSelector((state) => state.Search);
    const {chosenPageTVShow} = useAppSelector((state) => state.ChosenPage);
    const {
        paginationDownloaded,
        paginationFiltered,
        observer_position,
        scroll_position,
    } = useAppSelector((state) => state.PaginationTVShows);
    // console.log('.', observer_position, "tvShowsDownloaded", tvShowsDownloaded, "tvShowsFiltered:", tvShowsFiltered,
    //     "paginationFiltered:", paginationFiltered, "paginationDownloaded:", paginationDownloaded)

    const observerRef = useRef<IntersectionObserver | null>(null);
    const tvShowsListContainerRef = useRef<Element | null>(null);
    const searchNameRef = useRef<string>('');
    const chosenGenresIdRef = useRef<number[]>([]);
    const chosenPageRef = useRef<number>(1);
    const pageChangeInit = () => {
        if (tvShowsListContainerRef.current && tvShowsListContainerRef.current.scrollTop > tvShowsListContainerRef.current.scrollHeight - 1500 && chosenPageTVShow !== paginationFiltered.total_pages) {
            dispatch(setChosenPageTVShow(chosenPageTVShow + 1))
        }
    }

    const observeElements = () => {
        const observedElements = Array.from(document.getElementsByClassName('observed'));
        observedElements.forEach(element => observerRef.current?.observe(element));
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dispatch(PaginationTVShowAction.setObserverPosition(Number(entry.target.className.match(/(?<=id_)\d*/))))
                dispatch(PaginationTVShowAction.setScrollPosition(tvShowsListContainerRef.current?.scrollTop))
            }
        });
    }

    const scrollHandle = debounce(() => {
        observeElements()
        pageChangeInit()
    }, 100)

    useEffect(() => {
        // console.log("use Effect 1 fired: adeventlidtener for scroll")
        if (loadingStateTVShows) return;
        tvShowsListContainerRef.current = document.getElementsByClassName(styles.movieListContainer)[0]
        // observeElements()
        tvShowsListContainerRef.current?.addEventListener('scroll', scrollHandle)
        return () => {
            tvShowsListContainerRef.current?.removeEventListener('scroll', scrollHandle)
            observerRef.current?.disconnect();
        };

    }, [tvShowsFiltered]);

    useEffect(() => {
        // console.log("use Effect 2 fired: RefVariables, position scroll to position obcerver, list to observe register")
        searchNameRef.current = searchNameTVShow;
        chosenGenresIdRef.current = chosenGenresTVShowsId;
        chosenPageRef.current = chosenPageTVShow;

        const observeOption: IntersectionObserverInit = {
            root: document.getElementsByClassName(styles.moviesListBase)[0] as HTMLDivElement,
            rootMargin: '0px',
            threshold: 0.5,
        };

        // Create the IntersectionObserver instance only once
        observerRef.current = new IntersectionObserver(handleIntersection, observeOption);
        pageChangeInit()

        // scroll to previous position upon return to the page
        tvShowsListContainerRef.current?.scrollTo(0, scroll_position);
        // console.log("scroll_position:", scroll_position, tvShowsListContainerRef.current)
        return () => observerRef.current?.disconnect();
    }, []);


    useEffect(() => {

        // console.log("use Effect 3 fired: tvShow download logic")
        if (loadingStateTVShows) return; // Prevents reloading if data is already loading
        // console.log('tvShowSearchNameRef.current', searchNameRef.current)
        // console.log('searchNameTVShow', searchNameTVShow)
        switch (true) {
            case !tvShowsFiltered.length && !tvShowsDownloaded.length && !searchNameTVShow : {
                // console.log("1: movies empty / no title", chosenPageTVShow)

                dispatch(
                    TVShowsActions.searchTVShows({
                        searchByTitle: !!
                            searchNameTVShow,
                        query: `?page=${chosenPageTVShow}&with_genres=${chosenGenresTVShowsId.join()}`,
                    })
                )
            }
                break;

            case  searchNameRef.current !== searchNameTVShow : {
                // console.log("2: title search > title changed")
                dispatch(TVShowsActions.searchTVShows({
                    searchByTitle: !!searchNameTVShow, query: `?query=${searchNameTVShow}&page=${chosenPageTVShow}`
                }))
            }
                break;
            case  JSON.stringify(chosenGenresIdRef.current) !== JSON.stringify(chosenGenresTVShowsId) : {
                // console.log(" chosenGenresIdRef.current:", chosenGenresIdRef.current,)
                // console.log(" chosenGenresTVShowsId:", chosenGenresTVShowsId,)
                if (!!searchNameTVShow) {
                    // console.log("3: genres changed > with title")
                    // console.log("filtered", tvShowsDownloaded)
                    const filtered = TVShowFiltering(tvShowsDownloaded);

                    dispatch(TVShowsActions.setTVShowsFiltered(filtered.results || []));
                    dispatch(PaginationTVShowAction.setPaginationFiltered(filtered));

                } else {
                    // console.log("4:3: genres changed > without title")
                    dispatch(
                        TVShowsActions.searchTVShows({
                            searchByTitle: !!searchNameTVShow,
                            query: `?page=${chosenPageTVShow}&with_genres=${chosenGenresTVShowsId.join()}`,
                        })
                    )
                }
            }
                break;
            case chosenPageRef.current !== chosenPageTVShow : {

                // console.log("5: page changed for endless pagination", chosenPageRef.current, chosenPageTVShow)
                if (!(!!searchNameTVShow)) {
                    dispatch(
                        TVShowsActions.endlessPaginationAction({
                            searchByTitle: !!
                                searchNameTVShow,
                            query: `?page=${chosenPageTVShow}&with_genres=${chosenGenresTVShowsId.join()}`,
                        })
                    )
                }
                break;
            }
        }

        searchNameRef.current = searchNameTVShow;
        chosenGenresIdRef.current = chosenGenresTVShowsId;
        chosenPageRef.current = chosenPageTVShow;
    }, [searchNameTVShow, chosenGenresTVShowsId, chosenPageTVShow]);

    useEffect(() => {
        // console.log("use Effect 4 fired: dovnloaded movie changed")
        if (loadingStateTVShows) return;
        if (!!searchNameTVShow) {
            // console.log("1: with title")
            const tvShowsFilter = TVShowFiltering(tvShowsDownloaded)

            // console.log("movies filtered before update", {...tvShowsFilter})
            dispatch(TVShowsActions.setTVShowsFiltered(tvShowsFilter.results || []))
            dispatch(PaginationTVShowAction.setPaginationFiltered(tvShowsFilter))
            // console.log('movies Filtered after update', {...tvShowsFilter})
        } else {
            // console.log("2: without title")
            // console.log('movies downloaded', tvShowsDownloaded)
            dispatch(TVShowsActions.setTVShowsFiltered(tvShowsDownloaded))
            dispatch(PaginationTVShowAction.setPaginationFiltered(paginationDownloaded))
        }

    }, [tvShowsDownloaded]);

    // console.log("scroll_position:", scroll_position,)
    // console.log("tvShowsFiltered", tvShowsFiltered.length)

    return (
        <div className={styles.moviesListBase}>
            {paginationFiltered.total_results > 1 && <ProgressBar observerPosition={observer_position}/>}
            {loadingStateTVShows || loadingStateGenres ? (
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
                    {tvShowsFiltered.length ? (
                        // chosenPageTVShow <= 500 ? (
                        tvShowsFiltered.map((tvShow, index) => (
                            <TVShowCard key={index} tvShow={tvShow}/>
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

export default TVShowsList;
