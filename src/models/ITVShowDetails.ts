import IGenre from "./IGenre";
import ITVShowEpisode from "./ITVShowEpisode";
import INetwork from "./INetwork";
import IProductionCompany from "./IProductionCompany";
import IProductionCountry from "./IProductionCountry";
import ITVShowSeason from "./ITVShowSeason";
import ILanguage from "./ILanguage";
import ICreatedBy from "./ICreatedBy";

export default interface ITVShowDetails {
    adult: false,
    backdrop_path: string,
    created_by: ICreatedBy[],
    episode_run_time: number[],
    first_air_date: string,
    genres: IGenre[],
    homepage: string,
    id: number,
    in_production: true,
    languages: string [],
    last_air_date: string,
    last_episode_to_air: ITVShowEpisode,
    name: string,
    next_episode_to_air: ITVShowEpisode,
    networks: INetwork[],
    number_of_episodes: number,
    number_of_seasons: number,
    origin_country: string [],
    original_language: string,
    original_name: string,
    overview: string,
    popularity: number,
    poster_path: string,
    production_companies: IProductionCompany[],
    production_countries: IProductionCountry[],
    seasons: ITVShowSeason[],
    spoken_languages: ILanguage[],
    status: string,
    tagline: string,
    type: string,
    vote_average: number,
    vote_count: number
}