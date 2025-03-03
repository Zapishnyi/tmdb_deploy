import IPaginationInfo from './IPaginationInfo';
import ITVShow from './ITVShow';

export default interface ITVShowsPaginated extends IPaginationInfo {
  results?: ITVShow[];
}
