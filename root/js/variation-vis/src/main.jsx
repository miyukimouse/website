import React from 'react';
import { render } from 'react-dom';
import Track from './Track.jsx';
import svgPanZoom from 'svg-pan-zoom';

const DEFAULT_VISIBLE_WIDTH = 100;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      center: DEFAULT_VISIBLE_WIDTH/2,
      zoomFactor: 1,
      lastMoveTime: Number.NEGATIVE_INFINITY
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

  handlePan = (event) => {
    // console.log(event.deltaX);
    // const now = (new Date()).getTime();
    // console.log(now);
    // if (now - this.state.lastMoveTime > 300){
    //   const xMovement = event.deltaX;
    //   this.setState((prevState) => {
    //     return {
    //       center: prevState.center + xMovement / 1
    //     }
    //   })
    // }
  }

  _getVisibleWidth = () => {
    return DEFAULT_VISIBLE_WIDTH;
  }

  _getXMin = () => {
    return Math.floor(this.state.center - this._getVisibleWidth()/2);
  }


  getViewBox = () => {
    const x = this._getXMin();
    return [x, 0, DEFAULT_VISIBLE_WIDTH, 40].join(' ');
  }


  componentDidMount() {
    const svgElement = svgPanZoom('#svg-browser', {
    //  viewportSelector: '.svg-pan-zoom_viewport'
    panEnabled: true,
    separateZoomsEnabled: true,
    beforeZoom: (zooms) => {
      if (this.state.zoomLockOn) {
        console.log('zoom canceled')
        return false;
      }
      return {x: true, y: false};
    },
    beforePan: () => {
      return {x: true, y: false};
    },
    onZoom: (zooms) => {

      this.setState((prevState) => {
        const newZoomFactor = zooms.x;
        const newCenter = false ? this.svgX(event.target.clientX) : this.state.center;
        return {
          center: newCenter,
          zoomFactor: newZoomFactor //< 1 ? 1 : newZoomFactor
        }
      })
    }
    //, controlIconsEnabled: false
    //, zoomEnabled: false
    // , dblClickZoomEnabled: true
    // , mouseWheelZoomEnabled: true
    // , preventMouseEventsDefault: true
    , zoomScaleSensitivity: 0.8
    // , minZoom: 0.5
    // , maxZoom: 10
    //, fit: false
    , contain: false
    , center: false
    // , refreshRate: 'auto'
    // , beforeZoom: function(){}
    // , onZoom: function(){}
    // , beforePan: function(){}
    // , onPan: function(){}
    // , eventsListenerElement: null
    });
    $('#svg-browser').css({width: '500px'})
    svgElement.resize()
//svgElement.setAttribute('width', 500)
    console.log(svgElement.getZoom());
    //this.svgElement = svgElement;

  }

  componentWillUpdate() {
   // this.svgElement.destroy();
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

    const containerStyle = {
      // overflowX: 'scroll',
      // //padding: '0 5',
      // width: 400
      width: 500,
      height: 200,
      border:"1px solid black"
    }

    return (
      <div>
        <div style={{margin: "20px"}}>
          <button onClick={this.createZoomHandler(2)}>Zoom in (+)</button>
          <button onClick={this.createZoomHandler(0.5)} style={{margin: "0 20px"}}>Zoom out (-)</button>
        </div>
        <div style={containerStyle}>
        <svg id="svg-browser" className={this.state.center}
          onWheel={this.handlePan}
          viewBox={this.getViewBox()}
          preserveAspectRatio="none meet">
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

