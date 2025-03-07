import { FC } from 'react';

import { Link } from 'react-router-dom';

import translate from '../../assets/translate.json';
import { useAppSelector } from '../../redux/store';

import styles from './ErrorPage.module.css';

const ErrorPage: FC = () => {
  const { language } = useAppSelector((state) => state.Language);
  return (
    <div className={styles.errorPageWrapper}>
      <h1>{translate.Error_message[language]}</h1>
      <>
        <Link to={'/movies'}>{translate.Error_action[language]}</Link>
      </>
    </div>
  );
};

export default ErrorPage;
