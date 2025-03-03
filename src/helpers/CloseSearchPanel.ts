export const CloseSearchPanel = () => {
  const searchPanel = document.getElementsByClassName(`search`)[0] as HTMLDivElement;
  const searchButton = document.getElementsByClassName(`searchButton`)[0] as HTMLDivElement;
  searchPanel.classList.remove('visible');
  searchButton.classList.remove('changeOver');
};
