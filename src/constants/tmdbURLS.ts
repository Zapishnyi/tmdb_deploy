export const urlBase = 'https://api.themoviedb.org/3';

export const url = {
  movie: {
    genres: (language: string) => `/genre/movie/list?language=${language}`,
    allByGenres: (query: string): string => `/discover/movie${query}`,
    allByTitle: (query: string): string => `/search/movie${query}`,
    oneById: (id: number, language: string): string => `/movie/${id}?language=${language}`,
    credits: (id: number, language: string): string => `/movie/${id}/credits?language=${language}`,
    images: (id: number): string => `/movie/${id}/images`,
    videos: (id: number, language: string): string => `/movie/${id}/videos?language=${language}`,
  },
  tvShow: {
    genres: (language: string) => `/genre/tv/list?language=${language}`,
    allByGenres: (query: string): string => `/discover/tv${query}`,
    allByTitle: (query: string): string => `/search/tv${query}`,
    oneById: (id: number, query: string): string => `/tv/${id}?${query}`,
    season: (show_id: number, season_no: number): string => `/tv/${show_id}/season/${season_no}?language=uk`,
  },
};

export const urlImage = (image_path: string): string => `https://image.tmdb.org/t/p/w500${image_path}`;
