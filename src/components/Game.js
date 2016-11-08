import React from 'react';
import { Link } from 'react-router';
import { initializeGame } from '../llama-game';

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      player: JSON.parse(localStorage.player),
      cheermsg: false
    }
  }

  render() {
    return(
      <div id="game-container">
        {this.displayCheer()}
        <section id="user-info-and-controls">
          <h2>{this.state.player.name}</h2>
          <p>{this.state.player.location.split(',')[0]}</p>
          <button id="start-game">Start Work Out</button>
          <button id="stop-game" className='no-visible'>Take a Break</button>
          <button id="cheer-up" className='no-visible' onClick={this.showCheer.bind(this)}>Cheer {this.state.player.llamaName} Up!</button>
          <button id="feed" className='no-visible'>Feed {this.state.player.llamaName}</button>

          <Link to='/' id="exit-button">EXIT</Link>

          <div id="instructions">
            <p>Use &gt; to speed up</p>
            <p>Use &lt; to slow down</p>
            <p>Use space/click to jump</p>
          </div>
        </section>

        <section id="user-pic">
          <img src={this.state.player.image} alt="user image"/>
        </section>

        <section id="llama-info">
          <h3>{this.state.player.llamaName}</h3>
          <p>Calories: <span id="calories">2000</span></p>
        </section>

        <div id="three-container"></div>
      </div>
    )
  }

  // After render call: after the game component is initialized, it calls initialize game. This function is imported from the llama.js file
  componentDidMount() {
    initializeGame();
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

  displayCheer() {
    if (this.state.cheermsg) {
      return(
        <p id="cheer">{this.randomCheerUp()}</p>
      )
    }
  }

  showCheer(e) {
    e.preventDefault();
    this.setState({
      cheermsg: true
    });
    setTimeout(function() {
      this.setState({
        cheermsg: false
      });
    }.bind(this), 4000);
  }
}

export default Game;
