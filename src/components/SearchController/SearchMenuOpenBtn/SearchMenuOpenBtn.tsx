import { FC, RefObject } from 'react';

import MagnifyingGlassBtn from '../../MagnifyingGlassBtn/MagnifyingGlassBtn';

import styles from './SearchMenuOpenBtn.module.css';

interface IProps {
  searchPanel: RefObject<HTMLDivElement | null>;
  searchButton: RefObject<HTMLDivElement | null>;
  visibleActionClassName: string;
  changeOverClassName: string;
}
const SearchMenuOpenBtn: FC<IProps> = ({ searchButton, searchPanel, visibleActionClassName, changeOverClassName }) => {
  const clickHandle = () => {
    if (searchPanel.current && searchButton.current) {
      searchPanel.current.classList.add(visibleActionClassName);
      searchButton.current.classList.add(changeOverClassName);
    }
  };

  return (
    <div onClick={clickHandle} className={styles.burgerMenu}>
      <MagnifyingGlassBtn />
    </div>
  );
};

export default SearchMenuOpenBtn;
