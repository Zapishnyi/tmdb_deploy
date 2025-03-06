import { FC, useState } from 'react';

import IVideo from '../../models/IVideo';

import styles from './YouTubeVideo.module.css';

interface IProps {
  videoInfo: IVideo;
}

const YouTubeVideo: FC<IProps> = ({ videoInfo }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const clickHandler = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
    setIsLoaded(true);
  };
  return (
    <div className={styles.videoWrapper} onClick={clickHandler}>
      {isLoaded ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoInfo.key}`}
          title={videoInfo.name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <img src={`https://img.youtube.com/vi/${videoInfo.key}/hqdefault.jpg`} alt={videoInfo.name} width="100%" />
      )}

      <p>{`${videoInfo.type}  / ${videoInfo.name}`}</p>
    </div>
  );
};

export default YouTubeVideo;
