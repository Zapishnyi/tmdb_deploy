import React, {FC} from "react";
import styles from "./BackButton.module.css";
import ViewTransitionHandle from "../../helpers/ViewTransitionHandle";
import {useNavigate} from "react-router-dom";

interface IProps {
    to: string
}

const BackButton: FC<IProps> = ({to}) => {
    const navigate = useNavigate();
    return (
        <div className={styles.backButton} onClick={() => ViewTransitionHandle(to, navigate)}>
            <p>Back</p>
        </div>
    );
};

export default BackButton;
