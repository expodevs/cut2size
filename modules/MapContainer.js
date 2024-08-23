import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';


export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
    };

    onMarkerClick = (props, marker, e) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    onMapClicked = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };



    render() {
        let address = (this.props.address && this.props.address[0] && this.props.address[0].value) ?
            this.props.address[0].value : '';

        let location = (this.props.location && this.props.location[0] && this.props.location[0].value) ?
            {
                lat:parseFloat(this.props.location[0].value.split(',')[0]),
                lng:parseFloat(this.props.location[0].value.split(',')[1] )
            } : {};

        return (
            <Map google={this.props.google}

                 initialCenter={location}
                 zoom={10}
               onClick={this.onMapClicked}
                onReady={(mapProps, map)=>{
                    console.log('READY');
                    console.log(mapProps, map);
                }}
                >
                <Marker onClick={this.onMarkerClick}
                        position={location}
                        name={address} />
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <h1>{this.state.selectedPlace.name}</h1>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}
const LoadingContainer = (props) => (
    <div>Fancy loading container!</div>
);
export default GoogleApiWrapper({
    apiKey: ( process.env.REACT_APP_GOOGLE_API_KEY),
    LoadingContainer: LoadingContainer
})(MapContainer)
