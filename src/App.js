import './App.css';

// import {get_event_daily} from './serverCall';

import {EventChart, StatsChart} from './BarChart';
import {EventTable, StatsTable, PoiTable} from './Table';
import {Map} from './Map';

// class Pa extends react.Component{
//   render(){
//     return <p onClick={() => get_event_daily()}>
//     Edit <code>lalal</code> and save to reload.
//   </p>
//   }
// }

function App() {
  return (
    <div className="App">
      <p>Click on the bar to view hourly stats. Click anywhere on the chart again to return to the original view.</p>
      <EventChart height={300} width={500} />
      <p>Click on the bar to view hourly stats. Click anywhere on the chart again to return to the original view.</p>
      <StatsChart height={500} width={700} />
      <Map/>
      <div className="TableContainer">
        <EventTable />
        <StatsTable />
        <PoiTable />
      </div>
    </div>
  );
}

export default App;
