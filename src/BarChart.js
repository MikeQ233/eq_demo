import React from 'react';
import {get_event_daily, get_event_hourly, get_stats_daily, get_stats_hourly} from './serverCall';
import {BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line} from 'recharts';

// Colors from https://learnui.design/tools/data-color-picker.html#divergent
const COLORS = ['#488f31','#aaaf48','#ffce7a','#f18956','#de425b'];

const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function MyBarChart(data, X_Axis, domain, bars, width, height, onClick){
    return (
        <BarChart 
            width={width}
            height={height}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            onClick={()=>onClick()}
        >
            <XAxis dataKey={X_Axis} />
            <YAxis domain={domain}/>
            <Tooltip />
            <Legend />
            {bars}
        </BarChart>
    );
}

function makeChartBars(barTypes, barSize, onClick) {
    return barTypes.map((key, idx) => {
        return <Bar key={idx} dataKey={key} fill={COLORS[idx]} barSize={barSize}
                    onClick={(e)=>onClick(e)}/>
    });
}

function populateMapByDate(data, myMap) {
    let pre = "";
    data.forEach((item) => {
        if (item.date === pre) {
            myMap.get(pre).push(item);
        } else {
            pre = item.date;
            // this is a new date record
            myMap.set(pre, [item]);
        }
    })
}

function getMinAndMax(data, entry){
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    data.forEach(element => {
        if (element[entry] < min) {
            min = element[entry];
        }
        if (element[entry] > max) {
            max = element[entry]
        }
    });
    return [min, max];
}

class EventChart extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            barTypes: [],
            XAxis: null,
            dataHourly: null,
            selectedDate: null,
            showDaily: true,
        };
        this.barSize = props.barSize;
        this.domainDaily = 0;
        this.domainHourly = 0;
    }

    barOnClick(bar) {
        const date = bar.date;
        // we already did a server call
        // so the Map is populated
        if (this.state.dataHourly) {
            this.setState({
                showDaily: false,
                selectedDate: date,
                barTypes: ['events'],
                XAxis: "hour",
            });
        } else {
            get_event_hourly().then((data) => {
                const myMap = new Map();
                populateMapByDate(data, myMap)
                const mm = getMinAndMax(myMap.get(date), 'events')
                this.domainHourly = [Math.max(mm[0]-10, 0), mm[1]];
                this.setState({
                    showDaily: false,
                    selectedDate: date,
                    dataHourly: myMap,
                    barTypes: ['events'],
                    XAxis: "hour"
                });
            }).catch((err) => {
                alert(err)
            })
        }
    }

    render() {
        if (this.state.showDaily) {
            const bars = makeChartBars(this.state.barTypes, this.barSize, this.barOnClick.bind(this));
            return MyBarChart(this.state.data, this.state.XAxis, 
                              this.domainDaily, bars, this.props.width, this.props.height,
                              ()=>{});
        } else {
            const bars = makeChartBars(this.state.barTypes, this.barSize, 
                         ()=>{});
            return MyBarChart(this.state.dataHourly.get(this.state.selectedDate),
                              this.state.XAxis, this.domainHourly, bars, this.props.width, this.props.height,
                              () => {this.setState({barTypes: ['events'], XAxis: 'dateString', showDaily: true})});
        }
    }

    componentDidMount() {
        get_event_daily().then(data => {
            data.forEach(element => {
                const d = new Date(element.date);
                element.dateString = `${MONTH[d.getMonth()]} ${d.getDate()}`;
            });
            const mm = getMinAndMax(data, 'events')
            this.domainDaily = [Math.max(mm[0]-10, 0), mm[1]];
            this.setState({
                data: data,
                barTypes: ['events'],
                XAxis: 'dateString',
            })
        }).catch((err) => {
            alert(err)
        })
    }
}


class StatsChart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            barTypesA: [],
            barTypesB: [],
            XAxis: null,
            barSize: props.barSize,
            dataHourly: null,
            selectedDate: null,
            showDaily: true
        };
        this.domainDaily = 0;
        this.domainHourly = 0;
    }

    barOnClick(bar) {
        const date = bar.date;
        // we already did a server call
        // so the Map is populated
        if (this.state.dataHourly) {
            this.setState({
                showDaily: false,
                selectedDate: date,
                XAxis: "hour",
            });
        } else {
            get_stats_hourly().then((data) => {
                const myMap = new Map();
                populateMapByDate(data, myMap);
                this.setState({
                    showDaily: false,
                    selectedDate: date,
                    dataHourly: myMap,
                    XAxis: "hour"
                });
            }).catch((err) => {
                alert(err)
            })
        }
    }

    render() {
        if (this.state.showDaily) {
            const barsA = makeChartBars(this.state.barTypesA, this.barSize, this.barOnClick.bind(this));
            const barsB = makeChartBars(this.state.barTypesB, this.barSize, this.barOnClick.bind(this));
            return [MyBarChart(this.state.data, this.state.XAxis, [0,10], barsA, this.props.width, this.props.height,()=>{}),
                    MyBarChart(this.state.data, this.state.XAxis, [0,10], barsB, this.props.width, this.props.height,()=>{})];
        } else {
            const barsA = makeChartBars(this.state.barTypesA, this.barSize, 
                          ()=>{})
            const barsB = makeChartBars(this.state.barTypesB, this.barSize, 
                          ()=>{})
            return [MyBarChart(this.state.dataHourly.get(this.state.selectedDate), this.state.XAxis, [0,10], barsA, this.props.width, this.props.height,
                    () => {this.setState({XAxis: 'dateString', showDaily: true})}),
                    MyBarChart(this.state.dataHourly.get(this.state.selectedDate), this.state.XAxis, [0,10], barsB, this.props.width, this.props.height,
                    () => {this.setState({XAxis: 'dateString', showDaily: true})})];
        }
    }

    componentDidMount() {
        get_stats_daily().then(data => {
            data.forEach(element => {
                const d = new Date(element.date);
                element.dateString = `${MONTH[d.getMonth()]} ${d.getDate()}`;
                element.revenue = parseFloat(element.revenue).toFixed(4);
            });
            this.setState({
                data: data,
                barTypesA: ['clicks', 'revenue'],
                barTypesB: ['impressions'],
                XAxis: 'dateString',
            })
        }).catch((err) => {
            alert(err)
        })
    }
}

export {
    EventChart, 
    StatsChart,
};