import React from 'react';
import { startGame } from '../llama';

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      player: JSON.parse(localStorage.player),

    }
  }

  render() {
    return(
      <div>
        <section id="user-info-and-controls">
          <h3>{this.state.player.name}</h3>
          <p>{this.state.player.location.split(',')[0]}</p>
          <button id="start-game">Start Work Out</button>
          <button id="stop-game" className='no-visible'>Take a Break</button>
          <button id="cheer-up" className='no-visible' onClick={this.showCheer.bind(this)}>Cheer {this.state.player.llamaName} Up!</button>
          <button id="feed" className='no-visible'>Feed {this.state.player.llamaName}</button>
        </section>
        <section id="user-pic">
          <img src={this.state.player.image} alt="user image"/>
        </section>
        <section id="llama-info">
          <h3>{this.state.player.llamaName}</h3>
          <p>Calories: <span id="calories">2000</span></p>
        </section>
        <div id="three-container" ref={(element) => {this.threeContainer = element}}></div>
      </div>
    )
  }

  componentDidMount() {
    startGame(this.threeContainer);
  }

  randomCheerUp() {
    let cheers = [
      `Go ${this.state.player.llamaName}, go!`,
      `Don't give up ${this.state.player.llamaName}, you can do this!`,
      `Trot like your momma taught you, ${this.state.player.llamaName}!`
    ];

    let i = Math.floor(Math.random() * cheers.length);
    return cheers[i];
  }

  showCheer(e) {
    e.preventDefault();
    alert(this.randomCheerUp());
  }
}

export default Game;
