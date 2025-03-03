import React, { FC, SyntheticEvent } from "react";

import { urlImage } from "../../constants/tmdbURLS";

interface IProps {
  poster_path: string;
  title: string;
  error_image_path: string;
  width_desktop: string;
  width_mobile: string;
  aspect_ratio: number;
}

const ImagePreview: FC<IProps> = ({
  poster_path,
  title,
  error_image_path,
  width_desktop,
  width_mobile,
  aspect_ratio,
}) => {
  const posterChangeToDefault = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = error_image_path;
  };
  const isMobile = window.matchMedia("(width < 800px)").matches;
  return (
    <div
      style={{
        width: isMobile ? width_mobile : width_desktop,
        aspectRatio: aspect_ratio,
      }}
    >
      <img
        src={urlImage(poster_path)}
        onError={posterChangeToDefault}
        alt={title}
        style={{
          width: isMobile ? width_mobile : width_desktop,
          aspectRatio: aspect_ratio,
        }}
      />
    </div>
  );
};

export default ImagePreview;
