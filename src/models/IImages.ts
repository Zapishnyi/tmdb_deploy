import IImage from './IImage';

export default interface IImages {
  id: number;
  backdrops: IImage[];
  logos: IImage[];
  posters: IImage[];
}
