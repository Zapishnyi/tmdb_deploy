import { FC } from 'react';

import { closeSearchPanel } from '../../../helpers/CloseSearchPanel';

import styles from './SearchMenuCloseBtn.module.css';

const SearchMenuCloseBtn: FC = () => {
  const clickHandle = () => {
    closeSearchPanel();
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" className={styles.wrapper} onClick={clickHandle}>
      <g>
        <g>
          <circle cx="12" cy="12" r="10" strokeWidth="2.5" />
          <path d="M9 9L14.9999 15" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M15 9L9 14.9999" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

export default SearchMenuCloseBtn;
