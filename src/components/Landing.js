import React from 'react';

class Landing extends React.Component {
  constructor() {
    super();
    this.state = {
      step: 'name',
      location: null,
      name: null
    }
  }

  submitName(e) {
    e.preventDefault();

    this.setState({
      step: 'geolocation',
      name: this.nameInput.value
    });

    window.navigator.geolocation.getCurrentPosition(
      this.geoSuccess.bind(this),
      this.geoError.bind(this)
    )
  }

  // Called after geolocation.getCurrentPosition: on success we're passed the position of the user
  geoSuccess(position) {
    const geocoder = new window.google.maps.Geocoder();
    const myLatLng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder.geocode({location: myLatLng}, this.geoComplete.bind(this));
  }

  // Called after google maps reverse lookup using user's lat and long. Have coords, wanna find address
  geoComplete(results, status) {
    this.setState({
      step: 'media',
      location: results[1].formatted_address
    });
    this.captureMedia();
  }

  // Called if getCurrentPosition is unable to fetch coords.
  geoError(error) {
    this.setState({
      step: 'media',
      location: 'unknown'
    });
    this.captureMedia();
  }

  captureMedia() {
    window.navigator.mediaDevices.getUserMedia({video: true}).then(this.displayMedia.bind(this));
  }

  displayMedia(stream) {
    this.videoElement.src = window.URL.createObjectURL(stream);
    this.videoElement.play();
  }

  render() {
    let stepHtml = '';

    if (this.state.step === 'name') {
      stepHtml = this.nameHtml();
    } else if (this.state.step === 'geolocation') {
      stepHtml = this.geolocationHtml();
    } else if (this.state.step === 'media') {
      stepHtml = this.mediaHtml();
    }

    return(
      <div className='container'>
        {stepHtml}
      </div>
    )
  }

  nameHtml() {
    return(
      <form onSubmit={this.submitName.bind(this)}>
        <div className="input-field">
          <input type="text" ref={(input) => {this.nameInput = input}} />
        </div>
        <div className="input-field">
          <button>Run</button>
        </div>
      </form>
    )
  }

  geolocationHtml() {
    return(
      <div>
        <h2>{this.state.name}</h2>
        <p>Detecting location....</p>
      </div>
    )
  }

  mediaHtml() {
    return(
      <div>
        <p>{this.state.name}</p>
        <p>{this.state.location}</p>
        <video ref={(input) => {this.videoElement = input}} src=""></video>
      </div>
    )
  }
}

export default Landing;
