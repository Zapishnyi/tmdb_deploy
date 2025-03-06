import { FC } from 'react';

import { getLanguageName } from '../../helpers/GetLanguageName';
import IVideo from '../../models/IVideo';

import styles from './YouTubeVideo.module.css';

interface IProps {
  videoInfo: IVideo;
}

const YouTubeVideo: FC<IProps> = ({ videoInfo }) => {
  return (
    <div className={styles.videoWrapper}>
      <iframe
        src={`https://www.youtube.com/embed/${videoInfo.key}`}
        title={videoInfo.name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <p>{`${videoInfo.type} / ${getLanguageName(videoInfo.iso_639_1)} / ${videoInfo.name}`}</p>
    </div>
  );
};

export default YouTubeVideo;
