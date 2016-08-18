'use strict';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
    } from 'react-native';


class WeatherApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      coords:{},
      temp:"",
      pressure:"",
      wind:"",
      description:"",
      humidity:""
    };
  }
  render() {

    return (
        <View style={styles.container}>
          <View style={styles.autocompleteContainer}>
            <GooglePlacesAutocomplete

                placeholder='Search'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                fetchDetails={true}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    var self=this;
                                    setTimeout(function(){
                                      self.getWeather({
                                        coords:details.geometry.location,
                                        city:details.formatted_address
                                      })
                                    },100);
                                }}
                getDefaultValue={() => {
                                  return ''; // text input default value
                                }}
                query={{
                                  // available options: https://developers.google.com/places/web-service/autocomplete
                                  key: 'AIzaSyDEEuYTxsoUTB5EEyd_z1upqlCzl7X1RQg',
                                  language: 'en', // language of the results
                                  types: '(cities)', // default: 'geocode'
                                }}
                styles={{
                                  description: {
                                    fontWeight: 'bold',
                                  },
                                  predefinedPlacesDescription: {
                                    color: '#1faadb',
                                  },
                                }}

                currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Current location"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                }}
                GooglePlacesSearchQuery={{
                                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                  rankby: 'distance',
                                  types: 'food',
                                }}


                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

                predefinedPlaces={[]}

                predefinedPlacesAlwaysVisible={false}
                />
          </View>
          <View style={styles.info}>
            <Text style={styles.titleText}>{this.state.city}</Text>
            <Text style={styles.openingText}> {this.state.temp}</Text>
            <Text style={styles.openingText}>{this.state.pressure}</Text>
            <Text style={styles.openingText}>{this.state.wind}</Text>
            <Text style={styles.openingText}>{this.state.description}</Text>
            <Text style={styles.openingText}>{this.state.humidity}</Text>
          </View>
        </View>
    );
  }
  getWeather(data){
    if(data.city!=null){

      return fetch('http://adress-server-to-change/weather?lat='+data.coords.lat+'&lng='+data.coords.lng)
          .then((response) => response.json())
          .then((responseJson) => {
              console.log(responseJson)
            this.setState({
              city:data.city,
              temp:"Temperature: "+Math.round(responseJson.main.temp-273) +" C" ,
              pressure:"Pressure: "+responseJson.main.pressure,
              wind:"Wind speed: "+responseJson.wind.speed,
              description:"Description: "+ responseJson.weather[0].description,
              humidity:"Humidity: "+responseJson.main.humidity
            })
          });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 0

  },
  autocompleteContainer: {

    top: 20

  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  info: {
    paddingTop: 100,
    flex: 4
  },
  infoText: {
    textAlign: 'center'
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center'
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center'
  },
  openingText: {
    textAlign: 'center'
  }
});



AppRegistry.registerComponent('WeatherApp', () => WeatherApp);
