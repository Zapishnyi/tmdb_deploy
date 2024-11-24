import ICrewMember from "./ICrewMember";
import IQuestStar from "./IQuestStar";

export default interface ISeasonExtended {
    _id: string;
    air_date: string;
    episodes: ISeasonExtended [];
    name: string;
    overview: string;
    id: number;
    poster_path: string;
    season_number: number
    vote_average: number
}
