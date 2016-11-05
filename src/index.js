import React from 'react';
// Import the render function from a module called react-dom
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';

import './css/style.css';

import Landing from './components/Landing';
import Game from './components/Game';
import NotFound from './components/NotFound';

const Root = () => {
  return(
    <BrowserRouter>
      <div>
        <Match exactly pattern="/" component={Landing} />
        <Match exactly pattern="/game" component={Game} />
        <Miss component={NotFound} />
      </div>
    </BrowserRouter>
  )
}

// Pass which component is to be rendered and where (div with id of main in index.html)
render(<Root/>, document.querySelector('#main'));
