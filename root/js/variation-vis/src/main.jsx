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

  static childContextTypes = {
    zoomFactor: React.PropTypes.number,
    viewWidth: React.PropTypes.number,
    xMin: React.PropTypes.number,
    center: React.PropTypes.number
  }

  getChildContext() {
    return {
      zoomFactor: this.state.zoomFactor,
      viewWidth: 500,
      xMin: this._getXMin(),
      center: this.state.center
    }
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

  _getXMin = () => {
    return Math.floor(this.state.center - this._getVisibleWidth()/2);
  }


  getViewBox = () => {
    const visibleWidth = this._getVisibleWidth();
    const x = this._getXMin();
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
    const sequence1 = 'MSVNDLQELIERRIPDNRAQLETSHANLQQVAAYCEDNYIQSNNKSAALEESKKFAIQALASVAYQINKMVTDLHDMLAL'
      + 'QTDKVNSLTNQVQYVSQVVDVHKEKLARREIGSLTTNKTLFKQPKIIAPAIPDEKQRYQRTPIDFSVLDGIGHGVRTSDP'
      + 'PRAAPISRATSSISGSSPSQFHNESPAYGVYAGERTATLGRTMRPYAPSIAPSDYRLPQVTPQSESRIGRQMSHGSEFGD'
      + 'HMSGGGGSGSQHGSSDYNSIYQPDRYGTIRAGGRTTVDGSFSIPRLSSAQSSAGGPESPTFPLPPPAMNYTGYVAPGSVV'
      + 'QQQQQQQMQQQNYGTIRKSTVNRHDLPPPPNSLLTGMSSRMPTQDDMDDLPPPPESVGGSSAYGVFAGRTESYSSSQPPS'
      + 'LFDTSAGWMPNEYLEKVRVLYDYDAAKEDELTLRENAIVYVLKKNDDDWYEGVLDGVTGLFPGNYVVPV*';

    const width = 100;  // hard code this for now

    return (
      <div>
        <div style={{margin: "20px"}}>
          <button onClick={this.createZoomHandler(2)}>Zoom in (+)</button>
          <button onClick={this.createZoomHandler(0.5)} style={{margin: "0 20px"}}>Zoom out (-)</button>
        </div>
        <div>
        <svg width={this.context.viewWidth} height="200"
          viewBox={this.getViewBox()}
          preserveAspectRatio="none meet"
          style={{position:'relative'}}>
          <Track index={0} tip="one track"
            sequence={sequence1}
            data={data1}
            width={width}/>
          <Track index={1} tip="track number 2" width={width}/>
        </svg>
        </div>
      </div>
    );
  }

}



render(<App/>, document.getElementById('variation-vis-container'));

