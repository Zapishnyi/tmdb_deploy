import { FC, useRef } from 'react';

import SearchForm from '../../forms/SearchForm/SearchForm';

import styles from './SearchController.module.css';
import SearchMenuCloseBtn from './SearchMenuCloseBtn/SearchMenuCloseBtn';
import SearchMenuOpenBtn from './SearchMenuOpenBtn/SearchMenuOpenBtn';

const SearchController: FC = () => {
  const searchBtnRef = useRef<HTMLDivElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={searchBtnRef} className={styles.searchButton}>
      <SearchMenuOpenBtn
        searchPanel={searchPanelRef}
        searchButton={searchBtnRef}
        visibleActionClassName={styles.visible}
        changeOverClassName={styles.changeOver}
      />
      <SearchMenuCloseBtn />

      <div ref={searchPanelRef} className={styles.searchPanel}>
        <SearchForm />
      </div>
    </div>
  );
};

export default SearchController;
