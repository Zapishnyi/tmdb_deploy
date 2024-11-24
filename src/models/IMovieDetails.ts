import ICollectionName from "./ICollectionName";
import IGenre from "./IGenre";
import IProductionCompany from "./IProductionCompany";
import IProductionCountry from "./IProductionCountry";
import ILanguage from "./ILanguage";

export default interface IMovieDetails {
    adult: boolean,
    backdrop_path: string,
    belongs_to_collection: ICollectionName,
    budget: number,
    genres: IGenre[],
    homepage: string,
    id: number,
    imdb_id: string,
    origin_country: string[],
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: IProductionCompany[],
    production_countries: IProductionCountry[],
    release_date: string,
    revenue: number,
    runtime: number,
    spoken_languages: ILanguage[],
    status: string,
    tagline: string,
    title: string,
    video: false,
    vote_average: number,
    vote_count: number
}