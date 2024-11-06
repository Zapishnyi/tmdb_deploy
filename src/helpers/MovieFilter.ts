import IMovie from "../models/IMovie";
import IMoviesPaginated from "../models/IMoviesPaginated";
import {store} from "../redux/store";

export const moviesFiltering = (movies: IMovie[]): IMoviesPaginated => {
    const {Search: {chosenGenresId}} = store.getState();

    const results = movies.filter((e: IMovie) =>

        chosenGenresId.reduce(
            (acc: boolean, curr: number): boolean => {

                return (!acc ? acc : e.genre_ids?.includes(curr))
            },
            true,
        ),
    );
    return results.length ? {
        results,
        page: Math.ceil((results?.length || 0) / 20),
        total_pages: Math.ceil((results?.length || 0) / 20),
        total_results: results?.length || 0,
    } : {
        results,
        page: 1,
        total_pages: 1,
        total_results: 0,
    }

}
