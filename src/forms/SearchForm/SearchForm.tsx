import React, {ChangeEvent, FC} from "react";
import {useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import styles from "./SearchForm.module.css";
import {SearchActions} from "../../redux/Slices/searchSlice";
import {useLocation, useNavigate} from "react-router-dom";
import MagnifyingGlassBtn from "../../components/MagnifyingGlassBtn/MagnifyingGlassBtn";
import {setChosenPage} from "../../redux/Slices/chosenPageSlice";

type FormType = {
    [key: string]: boolean | string;
};

interface IProps {
    style: string;
}

const SearchForm: FC<IProps> = ({style}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const {genres, movieSearchName, chosenGenresId} = useAppSelector(
        (state) => state.Search
    );

    const genresBoolean = genres
        .filter((e) => chosenGenresId.includes(e.id))
        .map((e) => ({[e.name]: e.id}));

    const {register, handleSubmit} = useForm<FormType>({
        defaultValues: Object.assign({movieSearchName}, ...genresBoolean),
    });
    const searchBarVisibleRemove = () => {
        const search = document.getElementsByClassName(`${style}`)[0] as HTMLDivElement
        search.classList.remove('visible')
    }

    const moviesSearch = (formData: FormType) => {

        dispatch(setChosenPage(1));
        dispatch(SearchActions.setMovieSearchName(formData.movieSearchName));
        searchBarVisibleRemove()
        navigate("/movies");
    };

    const genreChoiceNone = () => {
        dispatch(setChosenPage(1));
        dispatch(SearchActions.setChosenGenresId([]));
        searchBarVisibleRemove()
        for (let item of Array.from(
            document.getElementsByClassName(styles.genreInput)
        ) as HTMLInputElement[]) {
            item.checked = false;
        }
        if (location.pathname !== "/movies") {
            navigate("/movies");
        }
    };

    const genreChoiceHandler = (element: ChangeEvent<HTMLInputElement>) => {
        dispatch(setChosenPage(1));
        const chosenGenreId = genres
            .filter((e) => e.name === element.currentTarget.name)
            .map((e) => e.id)[0];
        const chosenGenresIdUpdated = [...chosenGenresId];
        chosenGenresIdUpdated.push(chosenGenreId);
        dispatch(
            SearchActions.setChosenGenresId(
                chosenGenresId.includes(chosenGenreId)
                    ? chosenGenresId.filter((e) => e !== chosenGenreId)
                    : chosenGenresIdUpdated
            )
        );
        if (location.pathname !== "/movies") {
            navigate("/movies");
        }
    };
    return (
        <form onSubmit={handleSubmit(moviesSearch)} className={styles.searchForm}>
            <div className={styles.searchField}>
                {/*<div className={styles.chosenGenres}>*/}
                {/*    <GenresBadgeSet genres_ids={chosenGenresId}/>*/}
                {/*</div>*/}
                <div className={styles.searchInputButton}>
                    <input type="text" {...register("movieSearchName")} />
                    <button className={styles.searchButton}>
                        <MagnifyingGlassBtn/>
                    </button>
                </div>
            </div>
            <div className={styles.genresToChose}>
                <label>
                    <input
                        type={"checkbox"}
                        checked={!chosenGenresId.length}
                        className={[styles.none, "genresNotChosen"].join(" ")}
                        onChange={genreChoiceNone}
                    />
                    None
                </label>
                {genres.map((genre) => (
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
