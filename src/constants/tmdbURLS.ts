export const urlBase = "https://api.themoviedb.org/3"


export const url = {
    movie: {
        genres: "/genre/movie/list",
        allByGenres: (query: string): string => `/discover/movie${query}`,
        allByTitle: (query: string): string => `/search/movie${query}`,
        oneById: (id: number): string => `/movie/${id}&language=ru`,
    },
    tvShow: {
        genres: "/genre/tv/list",
        allByGenres: (query: string): string => `/discover/tv${query}`,
        allByTitle: (query: string): string => `/search/tv${query}`,
        oneById: (id: number, query: string): string => `/tv/${id}?${query}`,
        season: (show_id: number, season_no: number): string => `/tv/${show_id}/season/${season_no}?language=uk`
    }

};

export const urlImage = (image_path: string): string =>
    `https://image.tmdb.org/t/p/w500${image_path}`;
