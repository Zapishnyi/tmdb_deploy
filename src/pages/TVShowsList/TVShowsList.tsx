import React, { FC, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import styles from "./TVShowsList.module.css";
import { debounce } from "lodash";

import { setChosenPageTVShow } from "../../redux/Slices/chosenPageSlice";
import { PaginationTVShowAction } from "../../redux/Slices/paginationTVShowSlice";
import { TVShowsActions } from "../../redux/Slices/tvShowsSlice";
import { TVShowFiltering } from "../../helpers/TVShowFilter";
import TVShowCard from "../../components/TVShowCard/TVShowCard";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { LanguageEnum } from "../../enums/languageEnum";
import { CloseSearchPanel } from "../../helpers/CloseSearchPanel";
import { FadeLoader } from "react-spinners";

const TVShowsList: FC = () => {
  const dispatch = useAppDispatch();

  const { tvShowsDownloaded, tvShowsFiltered, loadingStateTVShows } =
    useAppSelector((state) => state.TVShows);
  const { searchNameTVShow, chosenGenresTVShowsId, loadingStateGenres } =
    useAppSelector((state) => state.Search);
  const { chosenPageTVShow } = useAppSelector((state) => state.ChosenPage);
  const {
    paginationDownloaded,
    paginationFiltered,
    observer_position,
    scroll_position,
  } = useAppSelector((state) => state.PaginationTVShows);
  const { language } = useAppSelector((state) => state.Language);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const tvShowsListContainerRef = useRef<Element | null>(null);
  const searchNameRef = useRef<string>("");
  const chosenGenresIdRef = useRef<number[]>([]);
  const chosenPageRef = useRef<number>(1);
  const languageRef = useRef<LanguageEnum>(LanguageEnum.US);

  const pageChangeInit = () => {
    if (
      tvShowsListContainerRef.current &&
      tvShowsListContainerRef.current.scrollTop >
        tvShowsListContainerRef.current.scrollHeight - 1500 &&
      chosenPageTVShow !== paginationFiltered.total_pages
    ) {
      dispatch(setChosenPageTVShow(chosenPageTVShow + 1));
    }
  };

  const observeElements = () => {
    const observedElements = Array.from(
      document.getElementsByClassName("observed")
    );
    observedElements.forEach((element) =>
      observerRef.current?.observe(element)
    );
  };

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        dispatch(
          PaginationTVShowAction.setObserverPosition(
            Number(entry.target.className.match(/(?<=id_)\d*/))
          )
        );
        dispatch(
          PaginationTVShowAction.setScrollPosition(
            tvShowsListContainerRef.current?.scrollTop
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
    // console.log("use Effect 1 fired: adeventlidtener for scroll")
    if (loadingStateTVShows) return;
    tvShowsListContainerRef.current = document.getElementsByClassName(
      styles.movieListContainer
    )[0];
    // observeElements()
    tvShowsListContainerRef.current?.addEventListener("scroll", scrollHandle);
    return () => {
      tvShowsListContainerRef.current?.removeEventListener(
        "scroll",
        scrollHandle
      );
      observerRef.current?.disconnect();
    };
  }, [tvShowsFiltered]);

  useEffect(() => {
    // console.log("use Effect 2 fired: RefVariables, position scroll to position obcerver, list to observe register")
    searchNameRef.current = searchNameTVShow;
    chosenGenresIdRef.current = chosenGenresTVShowsId;
    chosenPageRef.current = chosenPageTVShow;
    languageRef.current = language;

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
    pageChangeInit();

    // scroll to previous position upon return to the page
    tvShowsListContainerRef.current?.scrollTo(0, scroll_position);
    // console.log("scroll_position:", scroll_position, tvShowsListContainerRef.current)
    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (loadingStateTVShows) return; // Prevents reloading if data is already loading

    switch (true) {
      case !tvShowsFiltered.length &&
        !tvShowsDownloaded.length &&
        !searchNameTVShow:
        {
          dispatch(
            TVShowsActions.searchTVShows({
              searchByTitle: !!searchNameTVShow,
              query: `?page=${chosenPageTVShow}&with_genres=${chosenGenresTVShowsId.join()}`,
            })
          );
        }
        break;
      case !searchNameTVShow && languageRef.current !== language:
        {
          tvShowsListContainerRef.current?.scrollTo(0, 0);
          dispatch(
            TVShowsActions.searchTVShows({
              searchByTitle: !!searchNameTVShow,
              query: `?page=${1}&with_genres=${chosenGenresTVShowsId.join()}&language=${language}`,
            })
          );
        }
        break;
      case searchNameRef.current !== searchNameTVShow:
        dispatch(
          TVShowsActions.searchTVShows({
            searchByTitle: !!searchNameTVShow,
            query: `?query=${searchNameTVShow}&page=${chosenPageTVShow}&language=${language}`,
          })
        );
        break;
      case searchNameTVShow && languageRef.current !== language:
        {
          dispatch(
            TVShowsActions.searchTVShows({
              searchByTitle: !!searchNameTVShow,
              query: `?query=${searchNameTVShow}&page=${chosenPageTVShow}&language=${language}`,
            })
          );
        }
        break;

      case JSON.stringify(chosenGenresIdRef.current) !==
        JSON.stringify(chosenGenresTVShowsId):
        if (searchNameTVShow) {
          const filtered = TVShowFiltering(tvShowsDownloaded);
          dispatch(TVShowsActions.setTVShowsFiltered(filtered.results || []));
          dispatch(PaginationTVShowAction.setPaginationFiltered(filtered));
        } else {
          dispatch(
            TVShowsActions.searchTVShows({
              searchByTitle: !!searchNameTVShow,
              query: `?page=${chosenPageTVShow}&with_genres=${chosenGenresTVShowsId.join()}&language=${language}`,
            })
          );
        }
        break;
      case chosenPageRef.current !== chosenPageTVShow: {
        // console.log("5: page changed for endless pagination", chosenPageRef.current, chosenPageTVShow)
        if (!searchNameTVShow) {
          dispatch(
            TVShowsActions.endlessPaginationAction({
              searchByTitle: !!searchNameTVShow,
              query: `?page=${chosenPageTVShow}&with_genres=${chosenGenresTVShowsId.join()}&language=${language}`,
            })
          );
        }
        break;
      }
    }

    searchNameRef.current = searchNameTVShow;
    chosenGenresIdRef.current = chosenGenresTVShowsId;
    chosenPageRef.current = chosenPageTVShow;
    languageRef.current = language;
  }, [searchNameTVShow, chosenGenresTVShowsId, chosenPageTVShow, language]);

  useEffect(() => {
    // console.log("use Effect 4 fired: dovnloaded movie changed")
    if (loadingStateTVShows) return;
    if (searchNameTVShow) {
      // console.log("1: with title")
      const tvShowsFilter = TVShowFiltering(tvShowsDownloaded);

      // console.log("movies filtered before update", {...tvShowsFilter})
      dispatch(TVShowsActions.setTVShowsFiltered(tvShowsFilter.results || []));
      dispatch(PaginationTVShowAction.setPaginationFiltered(tvShowsFilter));
      // console.log('movies Filtered after update', {...tvShowsFilter})
    } else {
      // console.log("2: without title")
      // console.log('movies downloaded', tvShowsDownloaded)
      dispatch(TVShowsActions.setTVShowsFiltered(tvShowsDownloaded));
      dispatch(
        PaginationTVShowAction.setPaginationFiltered(paginationDownloaded)
      );
    }
  }, [tvShowsDownloaded]);

  // console.log("scroll_position:", scroll_position,)
  // console.log("tvShowsFiltered", tvShowsFiltered.length)

  return (
    <div className={styles.moviesListBase}>
      {paginationFiltered.total_results > 1 && (
        <ProgressBar observerPosition={observer_position} />
      )}
      {loadingStateTVShows || loadingStateGenres ? (
        <div className={styles.spinner}>
          <FadeLoader color="#9d9deb" />
        </div>
      ) : (
        <div className={styles.movieListContainer} onClick={CloseSearchPanel}>
          {tvShowsFiltered.length ? (
            tvShowsFiltered.map((tvShow, index) => (
              <TVShowCard key={index} tvShow={tvShow} />
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

export default TVShowsList;
