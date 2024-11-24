import React, {FC} from 'react';
import {Avatar} from "@mui/material";
import {urlImage} from "../../constants/tmdbURLS";
import stringAvatar from "../../helpers/MUI_StringAvatar";
import styles from './AvatarIcon.module.css'
import {deepOrange} from "@mui/material/colors";

interface IProps {
    name: string;
    iconPath: string | null;
}

const AvatarIcon: FC<IProps> = ({iconPath, name}) => {
    return (
        <div className={styles.avatar}>
            {iconPath ?
                <Avatar alt={name}
                        src={urlImage(iconPath)} sx={{width: 100, height: 100}}/> :
                <Avatar {...stringAvatar(name)}
                />}
            <p>{name}</p>
        </div>
    );
};

export default AvatarIcon;