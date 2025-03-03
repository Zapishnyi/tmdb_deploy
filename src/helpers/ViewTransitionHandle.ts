import {NavigateFunction} from "react-router-dom";


const ViewTransitionHandle = (to: string, navigate: NavigateFunction): void => {

    if (document.startViewTransition) {
        document.startViewTransition(() => {
            navigate(to)
        });
    } else {
    navigate(to);
    }
};
export default ViewTransitionHandle;