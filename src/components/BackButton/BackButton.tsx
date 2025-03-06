import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import translate from '../../assets/translation/translate.json';
import ViewTransitionHandle from '../../helpers/ViewTransitionHandle';
import { useAppSelector } from '../../redux/store';

import styles from './BackButton.module.css';

interface IProps {
  to: string;
}

const BackButton: FC<IProps> = ({ to }) => {
  const { language } = useAppSelector((state) => state.Language);
  const navigate = useNavigate();
  return (
    <div className={styles.backButton} onClick={() => ViewTransitionHandle(to, navigate)}>
      <p>{translate.Return[language]}</p>
    </div>
  );
};

export default BackButton;
