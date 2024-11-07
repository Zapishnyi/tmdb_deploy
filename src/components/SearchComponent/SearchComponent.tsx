import React, {FC} from "react";

import SearchForm from "../../forms/SearchForm/SearchForm";

interface IProps {
    style: string;
}

const SearchComponent: FC<IProps> = ({style}) => {

    return <SearchForm style={style}/>;
};

export default SearchComponent;
