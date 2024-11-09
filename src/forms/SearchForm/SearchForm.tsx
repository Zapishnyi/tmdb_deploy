import React, {ChangeEvent, FC, useEffect} from "react";
import {useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import styles from "./SearchForm.module.css";
import {SearchActions} from "../../redux/Slices/searchSlice";
import {useLocation, useNavigate} from "react-router-dom";
import MagnifyingGlassBtn from "../../components/MagnifyingGlassBtn/MagnifyingGlassBtn";
import {setChosenPageMovie, setChosenPageTVShow} from "../../redux/Slices/chosenPageSlice";


type FormType = {
    [key: string]: boolean | string;
};

interface IProps {
    style: string;
}

const SearchForm: FC<IProps> = ({style}) => {
    console.log('.')
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const {
        chosenGenresTVShowsId,
        chosenGenresMoviesId,
        genresMovies,
        genresTVShows,
        searchNameMovie,
        searchNameTVShow
    } = useAppSelector(
        (state) => state.Search
    );
    const isMovie = ['/movies', '/movie_info'].includes(location.pathname);
    const genresBoolean = (isMovie ? genresMovies : genresTVShows)
        // .filter((e) => isMovie ? chosenGenresMoviesId.includes(e.id) : chosenGenresTVShowsId.includes(e.id))
        .map((e) => ({[e.name]: isMovie ? chosenGenresMoviesId.includes(e.id) : chosenGenresTVShowsId.includes(e.id)}));

    console.log("genresBoolean", genresBoolean)
    const {register, handleSubmit, reset} = useForm<FormType>({
        defaultValues: Object.assign({[isMovie ? "searchNameMovie" : "searchNameTVShow"]: (isMovie ? searchNameMovie : searchNameTVShow)}, ...genresBoolean)
    });

    useEffect(() => {
            reset(
                Object.assign({[isMovie ? "searchNameMovie" : "searchNameTVShow"]: (isMovie ? searchNameMovie : searchNameTVShow)}, ...genresBoolean)
            )
        }
        , [isMovie]);
    const searchBarVisibleRemove = () => {
        const search = document.getElementsByClassName(`${style}`)[0] as HTMLDivElement
        search.classList.remove('visible')
    }

    const search = (formData: FormType) => {

        dispatch(isMovie ? setChosenPageMovie(1) : setChosenPageTVShow(1));
        dispatch(isMovie ? SearchActions.setMovieSearchName(formData.searchNameMovie) : SearchActions.setTVShowSearchName(formData.searchNameTVShow));
        searchBarVisibleRemove()
        navigate(isMovie ? "/movies" : "/tv_shows");
    };

    const genreChoiceNone = () => {
        dispatch(isMovie ? setChosenPageMovie(1) : setChosenPageTVShow(1));
        dispatch(isMovie ? SearchActions.setChosenGenresMoviesId([]) : SearchActions.setChosenGenresTVShowsId([]));
        searchBarVisibleRemove()
        for (let item of Array.from(
            document.getElementsByClassName(styles.genreInput)
        ) as HTMLInputElement[]) {
            item.checked = false;
        }
        // if (location.pathname !== "/movies") {
        //     navigate("/movies");
        // }
    };

    const genreChoiceHandler = (element: ChangeEvent<HTMLInputElement>) => {
        dispatch(isMovie ? setChosenPageMovie(1) : setChosenPageTVShow(1));
        const chosenGenreId = (isMovie ? genresMovies : genresTVShows)
            .filter((e) => e.name === element.currentTarget.name)
            .map((e) => e.id)[0];
        const chosenGenresIdUpdated = [...(isMovie ? chosenGenresMoviesId : chosenGenresTVShowsId)];
        chosenGenresIdUpdated.push(chosenGenreId);
        dispatch(
            isMovie ?
                SearchActions.setChosenGenresMoviesId(
                    chosenGenresMoviesId.includes(chosenGenreId)
                        ? chosenGenresMoviesId.filter((e) => e !== chosenGenreId)
                        : chosenGenresIdUpdated
                ) :
                SearchActions.setChosenGenresTVShowsId(
                    chosenGenresTVShowsId.includes(chosenGenreId)
                        ? chosenGenresTVShowsId.filter((e) => e !== chosenGenreId)
                        : chosenGenresIdUpdated
                )
        )


    };
    return (
        <form onSubmit={handleSubmit(search)} className={styles.searchForm}>
            <div className={styles.searchField}>
                {/*<div className={styles.chosenGenres}>*/}
                {/*    <GenresBadgeSet genres_ids={chosenGenresId}/>*/}
                {/*</div>*/}
                <div className={styles.searchInputButton}>
                    <input type="text" {...register(`${isMovie ? "searchNameMovie" : "searchNameTVShow"}`)} />
                    <button className={styles.searchButton}>
                        <MagnifyingGlassBtn/>
                    </button>
                </div>
            </div>
            <div className={styles.genresToChose}>
                <label>
                    <input
                        type={"checkbox"}
                        checked={isMovie ? !chosenGenresMoviesId.length : !chosenGenresTVShowsId.length}
                        className={[styles.none, "genresNotChosen"].join(" ")}
                        onChange={genreChoiceNone}
                    />
                    None
                </label>
                {(isMovie ? genresMovies : genresTVShows).map((genre) => (
                    <label key={genre.id}>
                        <input
                            className={styles.genreInput}
                            type={"checkbox"}
                            {...register(`${genre.name}`)}
                            onChange={genreChoiceHandler}
                        />
                        {genre.name}
                    </label>
                ))}
            </div>
        </form>
    );
};

export default SearchForm;
