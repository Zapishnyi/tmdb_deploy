import React, {FC} from "react";
import styles from "./BackButton.module.css";

const BackButton: FC = () => {
    return (
        <div className={styles.backButton}>
            <p>Back</p>
        </div>
    );
};

export default BackButton;
