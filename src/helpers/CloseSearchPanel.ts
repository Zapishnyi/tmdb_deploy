import styles from '../components/SearchController/SearchController.module.css';

export const closeSearchPanel = () => {
  const searchPanel = document.getElementsByClassName(styles.searchPanel)[0] as HTMLDivElement;
  const searchButton = document.getElementsByClassName(styles.searchButton)[0] as HTMLDivElement;

  if (searchPanel.classList.contains(styles.visible)) {
    searchPanel.classList.remove(styles.visible);
    searchButton.classList.remove(styles.changeOver);
  }
};
