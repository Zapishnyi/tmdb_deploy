import React, {FC} from "react";
import styles from "./SearchMenuButtonMobile.module.css";
import MagnifyingGlassBtn from "../MagnifyingGlassBtn/MagnifyingGlassBtn";

interface IProps {
    style: string;
}

const SearchMenuButtonMobile: FC<IProps> = ({style}) => {
    // const navigate = useNavigate();
    const clickHandle = () => {
        const searchPanel = document.getElementsByClassName(`${style}`)[0] as HTMLDivElement;
        searchPanel.classList.toggle('visible')
    }
    return (
        <div
            onClick={clickHandle}
            className={styles.burgerMenu}
        >
            <MagnifyingGlassBtn/>
        </div>
    );
};

export default SearchMenuButtonMobile;
