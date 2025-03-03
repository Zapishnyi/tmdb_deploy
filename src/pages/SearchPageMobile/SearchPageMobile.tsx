import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import styles from './SearPageMobile.module.css';

const SearchPageMobile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 800 && window.location.hash === '#/search') {
        navigate('/movies');
      }
    });
    return window.removeEventListener('resize', () => {});
  }, []);

  return <div className={styles.searchPage}>{/*<SearchComponent/>*/}</div>;
};

export default SearchPageMobile;
