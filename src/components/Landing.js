import React from 'react';
import { Link } from 'react-router';

class Landing extends React.Component {
  render() {
    return(
      <main>
        <h1>
          Welcome to
          <br/>
          Llama Training Campus
        </h1>

        <img src="llama_stroke.png" alt="llama image"/>
        <Link to='/registration' id="registration-button">Register</Link>
      </main>
    )
  }
}

export default Landing;
