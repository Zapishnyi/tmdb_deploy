import IActor from './IActor';

export interface ICredits {
  id: number;
  cast: IActor[];
  crew: IActor[];
}
