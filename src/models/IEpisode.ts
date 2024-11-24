import ICrewMember from "./ICrewMember";
import IQuestStar from "./IQuestStar";

export default interface IEpisode {
    air_date: string;
    episode_number: number;
    episode_type: string;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number
    show_id: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
    crew: ICrewMember[];
    guest_stars: IQuestStar[];
}