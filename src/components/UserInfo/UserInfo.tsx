import React from "react";
import styles from "./UserInfo.module.css";
import ColorThemeToggle from "../ColorThemeToggle/ColorThemeToggle";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { Link } from "react-router-dom";
import { setTheme } from "../../redux/Slices/themeSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const UserInfo = () => {
  const dispatch = useAppDispatch();
  const { lightThemeOn } = useAppSelector((state) => state.Theme);
  const onToggle = () => {
    dispatch(setTheme(!lightThemeOn));
    localStorage.setItem("lightThemeOn", JSON.stringify(!lightThemeOn));
  };
  return (
    <div className={styles.user}>
      <div>
        <img src={require("../../assets/images/user-profile.png")} alt="" />
        <p>John Doe</p>
      </div>

      <ul className={styles.menu}>
        <li onClick={onToggle}>
          <ColorThemeToggle />
        </li>
        <li>
          <LanguageSelector />
        </li>
      </ul>
    </div>
  );
};

export default UserInfo;
