import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import translate from '../../assets/translate.json';
import { useAppSelector } from '../../redux/store';

import styles from './BackButton.module.css';

interface IProps {
  to: string;
}

const BackButton: FC<IProps> = ({ to }) => {
  const { language } = useAppSelector((state) => state.Language);

  const navigate = useNavigate();
  return (
    <div className={styles.backButton} onClick={() => navigate(to)}>
      <p>{translate.Return[language]}</p>
    </div>
  );
};

export default BackButton;
