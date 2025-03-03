import React, { FC } from 'react';

import { CloseSearchPanel } from '../../helpers/CloseSearchPanel';

import styles from './SearchMenuCloseBtn.module.css';

const SearchMenuCloseBtn: FC = () => {
  const clickHandle = () => {
    CloseSearchPanel();
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" className={styles.wrapper} onClick={clickHandle}>
      <g id="style=linear">
        <g id="close-circle">
          <circle id="vector" cx="12" cy="12" r="10" strokeWidth="2.5" />
          <path id="vector_2" d="M9 9L14.9999 15" strokeWidth="1.5" strokeLinecap="round" />
          <path id="vector_3" d="M15 9L9 14.9999" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

export default SearchMenuCloseBtn;
