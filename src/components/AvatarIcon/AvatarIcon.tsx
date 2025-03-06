import { FC } from 'react';

import { Avatar } from '@mui/material';

import { urlImage } from '../../constants/tmdbURLS';
import stringAvatar from '../../helpers/MUI_StringAvatar';

import styles from './AvatarIcon.module.css';

interface IProps {
  name: string;
  iconPath: string | null;
  nameAlt?: string;
}

const AvatarIcon: FC<IProps> = ({ iconPath, name, nameAlt }) => {
  return (
    <div className={styles.avatar}>
      {iconPath ? (
        <Avatar alt={name} src={urlImage(iconPath)} sx={{ width: 100, height: 100 }} />
      ) : (
        <Avatar {...stringAvatar(name)} />
      )}
      <p>{name}</p>
      {(!!nameAlt || nameAlt !== 'as') && <p>{nameAlt}</p>}
    </div>
  );
};

export default AvatarIcon;
