export const tmdbDataURLS = {
    base: "https://api.themoviedb.org/3",
    allMovies: (query: string): string => `/discover/movie${query}`,
    searchMovies: (query: string): string => `/search/movie${query}`,
    allTVShows: (query: string): string => `/discover/tv${query}`,
    searchTVShows: (query: string): string => `/search/tv${query}`,
    MovieGenres: "/genre/movie/list",
    TVShowsGenres: "/genre/tv/list",
};

export const tmdbImageURL = (image_path: string): string =>
    `https://image.tmdb.org/t/p/w500${image_path}`;
