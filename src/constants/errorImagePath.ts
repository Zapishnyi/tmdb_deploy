import movieImage from '../assets/images/image_not_found.jpg';
import poster from '../assets/images/poster_not_found.jpg';
interface IErrorPath {
  poster: string;
  movieImage: string;
}

export const errorImage: IErrorPath = {
  poster,
  movieImage,
};
