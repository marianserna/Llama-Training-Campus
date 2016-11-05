import React from 'react';

class Landing extends React.Component {
  // Constructor -> Happens once: initialize class, setting initial values of the state (local daata of component)
  constructor() {
    // Set inheritance. Allow parent constructor to do its thing
    super();
    // 'this' is the component. Setting initial values for vars.
    this.state = {
      step: 'name',
      location: null,
      name: null,
      allowPic: false,
      image: null
    }
  }

  render() {
    let stepHtml = '';
    // Look at what step I am on and set the HTML to match it
    if (this.state.step === 'name') {
      stepHtml = this.nameHtml();
    } else if (this.state.step === 'geolocation') {
      stepHtml = this.geolocationHtml();
    } else if (this.state.step === 'media') {
      stepHtml = this.mediaHtml();
    }

    return(
      <div className='container'>
        { stepHtml }
      </div>
    )
  }

  // Event: Set state to the value of the input
  submitName(e) {
    e.preventDefault();

    // Setting component state
    this.setState({
      // Set the step I want to go next
      step: 'geolocation',
      // Setting the property name to be eq to the value of the input
      name: this.nameInput.value
    });
    this.initiGeo();
  }

  // Gets user current position
  initiGeo() {
    window.navigator.geolocation.getCurrentPosition(
      // Function to call when success
      this.geoSuccess.bind(this),
      // Function to call when error
      this.geoError.bind(this)
    );
  }

  // Called after geolocation.getCurrentPosition: on success we're passed the position of the user
  // Google translates coords into address
  geoSuccess(position) {
    const geocoder = new window.google.maps.Geocoder();
    const myLatLng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    geocoder.geocode({location: myLatLng}, this.geoComplete.bind(this));
  }

  // Called after google maps reverse lookup using user's lat and long. Have coords, wanna find address
  geoComplete(results, status) {
    // Update state
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
    // I still want to allow user to proceed even if no address was found.
    this.captureMedia();
  }

  // Tells browser I want to record video
  captureMedia() {
    // When promise finishes, call displayMedia function
    window.navigator.mediaDevices.getUserMedia({ video: true }).then(this.displayMedia.bind(this));
  }

  // localStream gets passed from the getUserMedia promise
  displayMedia(localStream) {
    this.stream = localStream;
    // Setting src attr for videoElement
    this.videoElement.src = window.URL.createObjectURL(localStream);
    this.videoElement.play();
  }

  takePicture(event) {
    event.preventDefault();
    //  Need to create canvas element to place the pic
    let canvas = window.document.createElement('canvas');
    canvas.setAttribute('width', this.videoElement.videoWidth);
    canvas.setAttribute('height', this.videoElement.videoHeight);
    let context = canvas.getContext('2d');
    // Draw video img into canvas
    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    // Stop video
    this.stream.getVideoTracks()[0].stop();

    const player = {
      name: this.state.name,
      location: this.state.location,
      image: canvas.toDataURL('image/png')
    };
    this.savePlayer(player);
    this.context.router.transitionTo('/game');
  }

  savePlayer(player) {
    localStorage.player = JSON.stringify(player);
  }

  // Contains input & button for initial step
  nameHtml() {
    return(
      <form onSubmit={this.submitName.bind(this)}>
        <div className="input-field">
          { /* When form gets submitted, I want the value of the input : need to set a ref -> lets me access input element */ }
          <input type="text" ref={ (input) => {this.nameInput = input} } />
        </div>
        <div className="input-field">
          <button>It's me!</button>
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
        { /* makes ref to video element so that I can access it later on */ }
        <video ref={(input) => {this.videoElement = input}}></video>
        { /* Setting context for when function gets called */ }
        <button onClick={this.takePicture.bind(this)}>Take Pic</button>
      </div>
    )
  }
}

Landing.contextTypes = {
  router: React.PropTypes.object
}

export default Landing;
