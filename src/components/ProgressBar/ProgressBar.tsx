import React, {FC} from 'react';
import {useAppSelector} from "../../redux/store";
import styles from '../ProgressBar/ProgressBar.module.css';
import IMovie from "../../models/IMovie";

interface IProbes {
    observerPosition: number
}

const ProgressBar: FC<IProbes> = ({observerPosition}) => {

    // console.log('.', observerPosition)

    const {total_pages, total_results} = useAppSelector(state => state.Pagination);
    const {movies} = useAppSelector(state => state.Movies);
    const currentPosition = () => {
        const index = movies.findIndex((e: IMovie): boolean => e.id === observerPosition);
        const marker = document.getElementsByClassName(styles.middle_mark)[0] as HTMLDivElement
        marker?.setAttribute("style", `top:${Math.round(((index / (total_pages > 500 ? 500 * 20 : total_results)) * 100)) - 2}%;  transition:top 0.5s`);
        const base = document.getElementsByClassName(styles.bar)[0] as HTMLDivElement
        base?.setAttribute("style", ` transition: opacity 5s; opacity:1;`);
        setTimeout(() => base?.setAttribute("style", ` transition: opacity 10s; opacity:0;`), 1000)

        return index;
    }
    return (
        <div className={styles.bar}>
            <div className={styles.top_mark}>
                <p>0</p>
            </div>
            <div className={styles.middle_mark}>
                <p>{currentPosition()}</p>

            </div>
            <div className={styles.bottom_mark}>
                <p>{total_pages > 500 ? 500 * 20 : total_results}</p>
            </div>

        </div>
    );
}

export default ProgressBar;