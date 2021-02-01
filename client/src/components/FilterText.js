import React from 'react';
import "./table.css";

const FilterText = (props) => {
    return(
        <span className="filter">
            Search Name: {" "}
            <input value = {props.filter} onChange={e => props.changeHandler(e.target.value, props.columnName)}/>
        </span>
    )
}

export default FilterText;