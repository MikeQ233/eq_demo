import React from 'react';
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';

import {get_poi} from './serverCall';

const containerStyle = {
  width: '800px',
  height: '600px'
};

const center = {
  lat: 43.6708,
  lng: -79.3899
};

const options = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  }

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    makeMarkers(clusterer) {
        return this.state.data.map((item) => {
            const position = {
                lat: item.lat,
                lng: item.lon
            }
            return <Marker key={item.poi_id} position={position} clusterer={clusterer} label={item.name}/>
        })
    }

    componentDidMount() {
        get_poi().then((data) => {
            this.setState({
                data: data,
            })
        }).catch(err => {
            alert(err);
        })
    }
    
    render() {
        return (
        <LoadScript
            googleMapsApiKey="AIzaSyAoTRQ4XHxOlEQVJO-3yMI_15G0lBZWH0U"
        >
            <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            >
            <MarkerClusterer options={options}>{ (clusterer) => this.makeMarkers(clusterer)}</MarkerClusterer>
            </GoogleMap>
        </LoadScript>
        )
    }
}

export {Map};