import { useTable, useFilters } from "react-table";
import React from 'react';
import { get_stats_hourly, get_event_hourly, get_poi } from "./serverCall";

import "./table.css";

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function RTable ({ columns, data, filterColumn, placeholder }) {

    // Create a state
    const [filterInput, setFilterInput] = React.useState("");

    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter(filterColumn, value);
        setFilterInput(value);
      };
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter
    } = useTable({
        columns,
        data
    }, useFilters)

    return (
        <table {...getTableProps()}>
            <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={placeholder}
            />
            <thead>
            {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row);
                return (
                <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                    })}
                </tr>
                );
            })}
            </tbody>
        </table>
    );
}


class MyTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        columns: [],
        data: [],
        filterColumn: '',
        placeholder: ''
        }
    }

    render() {
        return (
            <RTable columns={this.state.columns} data={this.state.data}
                    filterColumn={this.state.filterColumn}
                    placeholder={this.state.placeholder} />
        )
    }
}

class EventTable extends MyTable{
    componentDidMount() {
        get_event_hourly().then((data) => {
            data.forEach(element => {
                const d = new Date(element.date);
                element.dateString = `${MONTH[d.getMonth()]} ${d.getDate()}`;
            });
            this.setState({
                columns: [
                    {
                        Header: 'Date',
                        accessor: 'dateString'
                    },
                    {
                        Header: 'Hour',
                        accessor: 'hour'
                    },
                    {
                        Header: 'Events',
                        accessor: 'events'
                    }
                ],
                data: data,
                filterColumn: 'dateString',
                placeholder: 'Enter Date'
            })
        })
    }
}

class StatsTable extends MyTable{
    componentDidMount() {
        get_stats_hourly().then((data) => {
            data.forEach(element => {
                const d = new Date(element.date);
                element.dateString = `${MONTH[d.getMonth()]} ${d.getDate()}`;
            });
            this.setState({
                columns: [
                    {
                        Header: 'Date',
                        accessor: 'dateString'
                    },
                    {
                        Header: 'Hour',
                        accessor: 'hour'
                    },
                    {
                        Header: 'Impressions',
                        accessor: 'impressions'
                    },
                    {
                        Header: 'Clicks',
                        accessor: 'clicks'
                    },
                    {
                        Header: 'Revenue',
                        accessor: 'revenue'
                    },
                ],
                data: data,
                filterColumn: 'dateString',
                placeholder: 'Enter Date'
            })
        })
    }
}

class PoiTable extends MyTable{
    componentDidMount() {
        get_poi().then((data) => {
            this.setState({
                columns: [
                    {
                        Header: 'ID',
                        accessor: 'poi_id'
                    },
                    {
                        Header: 'Name',
                        accessor: 'name'
                    },
                    {
                        Header: 'Lat',
                        accessor: 'lat'
                    },
                    {
                        Header: 'Lon',
                        accessor: 'lon'
                    }
                ],
                data: data,
                filterColumn: 'name',
                placeholder: 'Enter name'
            })
        }).catch(err => {
            alert(err);
        })
    }
}

export {EventTable, StatsTable, PoiTable};