import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { FC } from "react";
import { urlImage } from "../../constants/tmdbURLS";
import ITVShowSeason from "../../models/ITVShowSeason";
import styles from "./Season.module.css";

interface IProps {
  season: ITVShowSeason;
}

const Season: FC<IProps> = ({ season }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`season-${season.season_number}`}
        id={`season-${season.season_number}`}
      >
        {season.name}
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.season}>
          <div className={styles.illustration}>
            <img src={urlImage(season.poster_path)} alt="" />
          </div>
          <div className={styles.content}>
            {season.air_date && <p>Premiere: {season.air_date}</p>}
            <p>Episodes: {season.episode_count}</p>
            <p>{season.overview}</p>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Season;
