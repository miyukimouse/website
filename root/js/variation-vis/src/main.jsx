import React from 'react';
import { render } from 'react-dom';
import Track from './Track.jsx';

class App extends React.Component {

  render() {
    return (
      <div>
        <svg width="500px" height="200px"
          viewBox="0 0 100 40">
          <Track index={0} tip="one track" />
          <Track index={1} tip="track number 2" />
        </svg>
      </div>
    );
  }

}



render(<App/>, document.getElementById('variation-vis-container'));

