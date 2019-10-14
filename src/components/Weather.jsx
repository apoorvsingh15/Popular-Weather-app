import React, { PureComponent } from 'react';
import Skycons from 'react-skycons';
import { geolocated } from "react-geolocated";
import { API_KEY } from '../API-KEY';

class Weather extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      resultData: {}
    }
  }

  componentDidUpdate = prevProps => {
    let { coords } = this.props;
    if (this.props.coords !== prevProps.coords) {
      fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${coords &&
        coords.latitude}&lon=${coords && coords.longitude}&APPID=${API_KEY}`)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            isLoaded: true,
            resultData: result
          })
        },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            })
          }
        )
    }
  }

  calculateTemperature = () => {
    const { resultData } = this.state;

    const tempInKelvin = resultData && resultData.main && resultData.main.temp;

    const tempInCelcius = tempInKelvin - 273.15;

    return tempInCelcius;
  }


  render() {
    const { resultData, isLoaded } = this.state;
    console.log(resultData, "<====");

    if (!isLoaded) {
      return (
        <div className="container">
          <h3>Loading...</h3>
        </div>
      )
    } else {
      return (
        <div className="container">
          <div className="inner-container">
            <div className="top-weather">
              <div><h2>{resultData && resultData.name}</h2></div>
              <div>
                <Skycons
                  color='white'
                  icon='PARTLY_CLOUDY_DAY'
                  autoplay={true}
                />
              </div>
            </div>
            <div className="centered">
              <h1>{this.calculateTemperature().toFixed(2)} C</h1>
            </div>
            <div className="centered">
              <h2>{(resultData && resultData.weather && resultData.weather[0].description).toUpperCase()}</h2>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true
  },
  userDecisionTimeout: 5000
})(Weather);