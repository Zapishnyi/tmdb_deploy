import React, {FC, SyntheticEvent} from "react";

import {urlImage} from "../../constants/tmdbURLS";

interface IProps {
    poster_path: string;
    title: string;
    error_image_path: string;
}

const ImagePreview: FC<IProps> = ({
                                      poster_path,
                                      title,
                                      error_image_path,
                                  }) => {
    const posterChangeToDefault = (e: SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = error_image_path;
    };
    return (
        <img
            src={urlImage(poster_path)}
            onError={posterChangeToDefault}
            alt={title}
        />
    );
};

export default ImagePreview;
