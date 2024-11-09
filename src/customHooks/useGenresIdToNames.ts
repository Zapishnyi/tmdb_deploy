import {useAppSelector} from "../redux/store";
import {useLocation} from "react-router-dom";

export const useGenresIdToName = (genres_ids: number[]) => {
    const location = useLocation()
    const isMovie = ['/movies', '/movie_info'].includes(location.pathname);
    const {genresMovies, genresTVShows} = useAppSelector((state) => state.Search);
    return genres_ids.map(
        (genre_id) => (isMovie ? genresMovies : genresTVShows).filter((genreSet) => genreSet.id === genre_id)[0]?.name,
    );

};
