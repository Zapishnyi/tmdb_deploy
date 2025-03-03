import ITVShow from '../models/ITVShow';
import ITVShowsPaginated from '../models/ITVShowsPaginated';
import { store } from '../redux/store';

export const TVShowFiltering = (tvShows: ITVShow[]): ITVShowsPaginated => {
  const {
    Search: { chosenGenresTVShowsId },
  } = store.getState();

  const results = tvShows.filter((e: ITVShow) =>
    chosenGenresTVShowsId.reduce((acc: boolean, curr: number): boolean => {
      return !acc ? acc : e.genre_ids?.includes(curr);
    }, true),
  );
  return results.length
    ? {
        results,
        page: Math.ceil((results?.length || 0) / 20),
        total_pages: Math.ceil((results?.length || 0) / 20),
        total_results: results?.length || 0,
      }
    : {
        results,
        page: 1,
        total_pages: 1,
        total_results: 0,
      };
};
