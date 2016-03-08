import React from 'react';
import { render } from 'react-dom';
import Track from './Track.jsx';

const DEFAULT_VISIBLE_WIDTH = 100;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      center: DEFAULT_VISIBLE_WIDTH/2,
      zoomFactor: 1,
    };
  }

  createZoomHandler = (multiple, locatable) => {
    return (event) => {
      this.setState((prevState) => {
        const newZoomFactor = prevState.zoomFactor * multiple;
        const newCenter = locatable ? this.svgX(event.target.clientX) : this.state.center;
        return {
          center: newCenter,
          zoomFactor: newZoomFactor < 1 ? 1 : newZoomFactor
        }
      })
    }

  }

  _getVisibleWidth = () => {
    return DEFAULT_VISIBLE_WIDTH / this.state.zoomFactor;
  }

  getViewBox = () => {
    const visibleWidth = this._getVisibleWidth();
    const x = Math.floor(this.state.center - visibleWidth/2)
    return [x, 0, visibleWidth, 40].join(' ');
  }

  render() {
    const data1 = [
      {
        xMin: 10,
        xMax: 25,
        tip: 'exon 1'
      },
      {
        xMin: 40,
        xMax: 70,
        tip: 'exon 2'
      }
    ];
    return (
      <div>
        <div style={{margin: "20px"}}>
          <button onClick={this.createZoomHandler(2)}>Zoom in (+)</button>
          <button onClick={this.createZoomHandler(0.5)} style={{margin: "0 20px"}}>Zoom out (-)</button>
        </div>
        <svg width="500px" height="200px"
          viewBox={this.getViewBox()}
          preserveAspectRatio="none meet">
          <Track index={0} tip="one track"
            data={data1}/>
          <Track index={1} tip="track number 2" />
        </svg>
      </div>
    );
  }

}



render(<App/>, document.getElementById('variation-vis-container'));

