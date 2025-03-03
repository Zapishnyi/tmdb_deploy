import React, { FC } from 'react';

import { Outlet } from 'react-router-dom';

import Header from '../../components/Header/Header';
import { useAppSelector } from '../../redux/store';

import styles from './MainLayout.module.css';

const MainLayout: FC = () => {
  const { lightThemeOn } = useAppSelector((state) => state.Theme);

  return (
    <div className={[styles.wrapper, lightThemeOn ? styles.light : styles.dark].join(' ')}>
      <Header />
      <Outlet />
    </div>
  );
};

export default MainLayout;
