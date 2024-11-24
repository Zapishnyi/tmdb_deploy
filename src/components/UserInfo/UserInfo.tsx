import React from "react";
import styles from "./UserInfo.module.css";
import ColorThemeToggle from "../ColorThemeToggle/ColorThemeToggle";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import {Link} from "react-router-dom";

const UserInfo = () => {
    return (
        <div className={styles.user}>
            <div>
                <img src={require("../../assets/images/user-profile.png")} alt=""/>
                <p>John Doe</p>
            </div>

            <ul className={styles.menu}>
                <li>
                    <Link to={"#"}>
                        <p>Sing up</p>
                    </Link>
                </li>
                <li>
                    <Link to={"#"}>
                        <p>Sing in</p>
                    </Link>
                </li>
                <li>
                    <Link to={"#"}>
                        <p>Log in</p>
                    </Link>
                </li>
                <li>
                    <Link to={"#"}>
                        <p>Log out</p>
                    </Link>
                </li>
                <li>
                    <ColorThemeToggle/>
                </li>
                <li>
                    <LanguageSelector/>
                </li>
            </ul>
        </div>

    );
};

export default UserInfo;
