import React, { FC } from "react";
import "@theme-toggles/react/css/Classic.css";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setTheme } from "../../redux/Slices/themeSlice";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import styles from "./ColorThemeToggle.module.css";

const ColorThemeToggle: FC = () => {
  const { lightThemeOn } = useAppSelector((state) => state.Theme);

  const dispatch = useAppDispatch();

  const onToggle = () => {
    dispatch(setTheme(!lightThemeOn));
    localStorage.setItem("lightThemeOn", JSON.stringify(!lightThemeOn));
  };

  return (
    <DarkModeSwitch
      className={styles.theme_toggle}
      checked={!lightThemeOn}
      onChange={onToggle}
      size={20}
      moonColor={"white"}
      sunColor={"yellow"}
    />
  );
};

export default ColorThemeToggle;
