export const searchFade = () => {
  const searchPanel = document.getElementsByClassName(`search`)[0] as HTMLDivElement;
  searchPanel.classList.remove('visible');
};
