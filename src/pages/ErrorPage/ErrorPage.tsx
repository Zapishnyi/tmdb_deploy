import { FC } from 'react';

import { Link } from 'react-router-dom';

import styles from './ErrorPage.module.css';

const ErrorPage: FC = () => {
  return (
    <div className={styles.errorPageWrapper}>
      <h1>Something went wrong, this page does not exist</h1>
      <>
        <Link to={'/movies'}>Return to MOVIES Page</Link>
      </>
    </div>
  );
};

export default ErrorPage;
