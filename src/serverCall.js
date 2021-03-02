import axios from 'axios';
import env from "react-dotenv";

const userToken = 123456;
axios.defaults.headers.get['userToken'] = userToken;

function get_data_request(url) {
  return new Promise((res, rej) => {
      axios({
          method: "GET",
          url: url,
        }).then((respose) => {
        //   console.log(respose)
          res(respose.data)
        }).catch((error) => {
          rej(error)
      });
  })
}


function get_event_daily() {
    return get_data_request(`${env.REACT_APP_SERVER_URL}/events/daily`);
}

function get_event_hourly() {
    return get_data_request(`${env.REACT_APP_SERVER_URL}/events/hourly`);
}

function get_stats_daily() {
    return get_data_request(`${env.REACT_APP_SERVER_URL}/stats/daily`);
}

function get_stats_hourly() {
    return get_data_request(`${env.REACT_APP_SERVER_URL}/stats/hourly`);
}

function get_poi() {
    return get_data_request(`${env.REACT_APP_SERVER_URL}/poi`);
}

export {
    get_event_daily,
    get_event_hourly,
    get_stats_daily,
    get_stats_hourly,
    get_poi
};