import React from 'react';
import { render } from 'react-dom';
import Track from './Track.jsx';
//import Button from './components/Button.jsx';
import { Button, Popover } from 'react-bootstrap';
import svgPanZoom from 'svg-pan-zoom';
require('./main.less');

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
    return [x, 0, DEFAULT_VISIBLE_WIDTH, 60].join(' ');
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
    $('#svg-browser').css({width: '100%', height:'100%'})
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
        start: 100,
        end: 250,
        tip: 'Domain 1'
      },
      {
        start: 400,
        end: 450,
        tip: 'Domain 2'
      }
    ];

    const variations1 = [
      {
        start: 120,
        end: 140,
        tip: 'v1'
      },
      {
        start: 160,
        end: 170,
        tip: 'v2'
      },
      {
        start: 150,
        end: 151,
        tip: 'v3'
      },
      {
        start: 153,
        end: 154,
        tip: 'v4'
      }
    ]
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
      height: 300,
      border:"1px solid black"
    }

    return (
      <div className="bootstrap-style">
        <div style={{margin: "20px"}}>
          <Button onClick={this.createZoomHandler(2)}>Zoom in (+)</Button>
          <Button onClick={this.createZoomHandler(0.5)} style={{margin: "0 20px"}}>Zoom out (-)</Button>
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
          <Track index={1} tip="one track"
            sequenceLength={sequence1.length}
            data={variations1}
            width={width}/>
          <Track index={2} tip="track number 2" width={width}/>
        </svg>
        <Popover placement="top" positionLeft={0} positionTop={0} title="Popover right">
          And here's some <strong>amazing</strong> content. It's very engaging. right?
        </Popover>
        </div>
      </div>
    );
  }

}



render(<App/>, document.getElementById('variation-vis-container'));

