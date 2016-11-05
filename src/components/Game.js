import React from 'react';
import { startGame } from '../llama';

class Game extends React.Component {
  constructor() {
    super();

    this.state = JSON.parse(localStorage.player);
  }

  render() {
    return(
      // Adding div element to the component
      <div id="three-container" ref={(element) => {this.threeContainer = element}}></div>
    )
  }

  componentDidMount() {
    startGame(this.threeContainer);
  }

}

export default Game;
