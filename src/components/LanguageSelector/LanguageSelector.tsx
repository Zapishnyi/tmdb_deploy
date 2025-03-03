import { FC } from 'react';

import { LanguageEnum } from '../../enums/languageEnum';
import { setLanguage } from '../../redux/Slices/languageSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';

import styles from './LanguageSelector.module.css';

const LanguageSelector: FC = () => {
  const { language } = useAppSelector((state) => state.Language);
  const dispatch = useAppDispatch();
  const handleChange = () => {
    dispatch(setLanguage(Object.values(LanguageEnum).filter((item) => item !== language)[0]));
  };
  return (
    <div className={styles.language} onClick={handleChange}>
      <span className={language === LanguageEnum.US ? styles.chosen : ''}>US</span>
      <span className={language === LanguageEnum.UA ? styles.chosen : ''}>UA</span>
      <div className={[styles.toggle_frame, language === LanguageEnum.UA ? styles.ua : ''].join(' ')}></div>
    </div>
  );
};

export default LanguageSelector;
