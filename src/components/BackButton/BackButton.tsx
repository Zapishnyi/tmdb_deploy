import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import ViewTransitionHandle from '../../helpers/ViewTransitionHandle';

import styles from './BackButton.module.css';

interface IProps {
  to: string;
}

const BackButton: FC<IProps> = ({ to }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.backButton} onClick={() => ViewTransitionHandle(to, navigate)}>
      <p>Return</p>
    </div>
  );
};

export default BackButton;
