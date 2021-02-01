import React from 'react';
import {STATUS} from "./constants";

const FilterSelect = (props) => {
    const statusOption = ((status,idx) => <option key={idx}>{status}</option>);

    return <select className="dd" value={props.filterSelect} onChange={(e) => props.changeHandler(e.target.value)}>{STATUS.map(statusOption)}</select>;
}

export default FilterSelect;