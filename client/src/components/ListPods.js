import React, {useEffect, useState} from 'react';
import {HEADINGS} from "./constants";
import DataTable from "./DataTable";
import "./table.css";
import FilterText from "./FilterText";
import FilterSelect from "./FilterSelect";
import {STATUS} from "./constants";

function ListPods() {
    const [podDetails, setPodDetails] = useState([]);
    const [row, setRowData] = useState([]);
    const [filter, setFilter] = useState("");
    const [filterSelect, setFilterSelect] = useState("");
    const [sortedObj, setSortedObj] = React.useState({columnName: "", isSorted: false, isSortedAsc: false});

    function handleSort(colName, colIndex){
        const nextIsSorteObj = {...sortedObj};
        
        if (sortedObj.columnName === "" ||sortedObj.columnName === colName) {
            if(!sortedObj.isSorted) {
                nextIsSorteObj.isSorted = true;
                nextIsSorteObj.isSortedAsc = true;
            } else {
                nextIsSorteObj.isSortedAsc = !nextIsSorteObj.isSortedAsc;
            }
        } else {
            nextIsSorteObj.isSorted = true;
            nextIsSorteObj.isSortedAsc = true;
        }

        setSortedObj({columnName: colName, isSorted: nextIsSorteObj.isSorted, isSortedAsc: nextIsSorteObj.isSortedAsc});
        
        const sortedRowArr = [...row]
        
        if (nextIsSorteObj.isSortedAsc) {
            if (colIndex === 3) {
                sortedRowArr.sort((a, b) => (Date.parse(a[colIndex]) > Date.parse(b[colIndex])) ? 1 : -1);
            } else {
                sortedRowArr.sort((a, b) => (a[colIndex] > b[colIndex]) ? 1 : -1);
            }
            
        } else{
            if (colIndex === 3) {
                sortedRowArr.sort((a, b) => (Date.parse(a[colIndex]) > Date.parse(b[colIndex])) ? -1 : 1);
            }else {
                sortedRowArr.sort((a, b) => (a[colIndex] > b[colIndex]) ? -1 : 1);
            }
            
        }
        
        setRowData(sortedRowArr);
    }

    function handleChange(val, colName) {
        setFilter(val);
        const debouncedGetData = debounce(filterText, 500);
        debouncedGetData(val, colName);
    }

    function filterText(val, colName) {
        let filteredPod = podDetails
        if(val.trim() !== "") {
            filteredPod = podDetails.filter((pod) => pod[colName].toLowerCase().indexOf(val.toLowerCase()) > -1);
        }
        const result = filteredPod.map(({ name, nameSpace, status, age }) => [name, nameSpace, status, age]);
        setRowData(result)
    }

    const debounce = (fn, delay) => {
        let setTimeoutID;
        return function(...args) {
            if (setTimeoutID) {
                clearTimeout(setTimeoutID);
            }
            setTimeoutID = setTimeout(() => {
                fn(...args)
            }, delay);
        }
    }

    function handleSelect(val) {
        setFilterSelect(val);
        let filteredPod = podDetails
        if(val.trim() !== "" && val.toLowerCase() !== STATUS[0].toLowerCase()) {
            filteredPod = podDetails.filter((pod) => {
                return pod.status.toLowerCase() === val.toLowerCase()
            });
        }
        const result = filteredPod.map(({ name, nameSpace, status, age }) => [name, nameSpace, status, age]);
        setRowData(result);
    }

    useEffect(()=> {
        fetch("http://localhost:8060/pods").then(response => response.json())
        .then(data => {
            data.forEach( pod => pod.age = new Date(pod.age).toString());
            setPodDetails(data);
            
            const result = data.map(({ name, nameSpace, status, age }) => [name, nameSpace, status, age]);
            setRowData(result);
        });
    }, [])

    return(
        <div>
            <h1 className="left">Pods</h1>
            <div className="left">
                <FilterText filter = {filter || ""} columnName = "name" changeHandler={handleChange}/>
                <FilterSelect filer = {filterSelect} changeHandler={handleSelect}/>
            </div>
            
            
            <DataTable headings={HEADINGS} rows={row} sortedObj={sortedObj} changeHandler={handleSort}/>
        </div>
    )
}

export default ListPods;