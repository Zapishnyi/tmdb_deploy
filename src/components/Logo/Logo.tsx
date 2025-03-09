import { FC } from 'react';

import { useNavigate } from 'react-router-dom';

import TMDBLogo from '../../assets/images/TMDB_logo2.png';

import styles from './Logo.module.css';

const Logo: FC = () => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/movies')} className={styles.logo}>
      <img src={TMDBLogo} alt="Logo" />
    </div>
  );
};

export default Logo;
