import React, {FC} from "react";
import styles from "./SearchMenuOpenBtn.module.css";
import MagnifyingGlassBtn from "../MagnifyingGlassBtn/MagnifyingGlassBtn";


const SearchMenuOpenBtn: FC = () => {
    // const navigate = useNavigate();

    const clickHandle = () => {
        const searchPanel = document.getElementsByClassName(`search`)[0] as HTMLDivElement;
        const searchButton = document.getElementsByClassName(`searchButton`)[0] as HTMLDivElement;
        searchPanel.classList.add('visible')
        searchButton.classList.add('changeOver');
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

export default SearchMenuOpenBtn;
