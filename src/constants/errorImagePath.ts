interface IErrorPath {
    poster: string;
    movieImage: string;
}

export const errorImage: IErrorPath = {
    poster: require("../assets/images/poster_not_found.jpg"),
    movieImage: require("../assets/images/image_not_found.jpg"),
};
