import "babel-polyfill";
import React from 'react';
import { render } from 'react-dom';
import Track from './Track.jsx';
//import Button from './components/Button.jsx';
import Tooltip from './components/Tooltip.jsx';
import ColorScheme, { COLORS } from './DataDecorator.js';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { ButtonGroup, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import svgPanZoom from 'svg-pan-zoom';

import { GeneModel } from './Utils.js';
require('./main.less');

const DEFAULT_VISIBLE_WIDTH = 1000;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      center: DEFAULT_VISIBLE_WIDTH/2,
      zoomFactor: 1,
      lastMoveTime: Number.NEGATIVE_INFINITY,

      // tooltips
      tooltip: null,
      tooltipEventID: 0,

      // zoomPan
      isZoomPanOccuring: false,
      zoomPanEventId: 0,

      // track data
      tracks: []
     };
  }

  static childContextTypes = {
    zoomFactor: React.PropTypes.number,
    viewWidth: React.PropTypes.number,
    xMin: React.PropTypes.number,
    center: React.PropTypes.number,
    isZoomPanOccuring: React.PropTypes.bool,
  }

  getChildContext() {
    return {
      zoomFactor: this.state.zoomFactor,
      viewWidth: 500,
      xMin: this._getXMin(),
      center: this.state.center,
      isZoomPanOccuring: this.state.isZoomPanOccuring
    }
  }

  getZoomHandler = (multiple) => {
    return (event) => {
      if (this.state.zoomPan){
        this.state.zoomPan.zoomBy(multiple);
      }
    }

  }

  getPanHandler = (delta) => {
    return () => {
      if (this.state.zoomPan){
        this.state.zoomPan.panBy({x: delta, y: 0});
      }
    }
  }

  _getVisibleWidth = () => {
    return DEFAULT_VISIBLE_WIDTH;
  }

  _getXMin = () => {
    return Math.floor(this.state.center - this._getVisibleWidth()/2);
  }


  getViewBox = () => {
    const x = this._getXMin();
    // return
    return [x, 0, DEFAULT_VISIBLE_WIDTH, 120].join(' ');
  }




  showTooltip = ({content, event}) => {

    // // Get point in global SVG space
    // function cursorPoint(evt){
    //   // Create an SVGPoint for future math
    //   const svg = evt.target.ownerSVGElement;
    //   const pt = svg.createSVGPoint();
    //   pt.x = evt.clientX;
    //   pt.y = evt.clientY;
    //   // return pt.matrixTransform(svg.getScreenCTM().inverse());
    //   return {
    //     x: 0,
    //     y: 0
    //   }
    // }

    // const {x, y} = cursorPoint(event);

    const containerBox = this.refs.myContainer.getBoundingClientRect();
    const targetBox = event.target.getBoundingClientRect();

    // console.log('called');
    // const x = targetBox.left - containerBox.left;
    // const y = targetBox.top - containerBox.top;

    // function getRectCoords(rect) {
    //   const {left, top, height, width} = rect;
    //   return {
    //     left,
    //     top,
    //     height,
    //     width
    //   };
    // }

    // const target = getRectCoords(targetBox);
    // const container = getRectCoords(containerBox);

    //event.stopPropagation();

    this.setState((prevState, currProps) => {
      return {
        tooltip: {
          content: content,
          target: targetBox,
          container: containerBox
        },
        tooltipEventID: prevState.tooltipEventID + 1,
      };
    });

  }



  hideTooltip = (event) => {
    const tooltipEventID = this.state.tooltipEventID;

    if (event && (event.relatedTarget.getAttribute('class') === 'sequence-text'
      || event.relatedTarget.getAttribute('is') === 'svg-text')) {
      return;
    }

    setTimeout(() => {
      this.setState((prevState, currProps) => {
        return prevState.tooltipEventID === tooltipEventID ? {
          tooltip: null
        } : {}
      });
    }, 200);
  }


  componentDidMount() {
    this._getData();
    // setTimeout(() =>
    //   this._setupZoomPan()
    //   , 5000);
  }

  _setupZoomPan() {
    const svgElement = svgPanZoom('#svg-browser-svg', {
    //  viewportSelector: '.svg-pan-zoom_viewport'
    panEnabled: true,
    separateZoomsEnabled: true,
    beforeZoom: (zooms) => {
      if (this.state.zoomLockOn) {
        return false;
      }
      return {x: true, y: false};
    },
    beforePan: () => {
      return {x: true, y: false};
    },
    onZoom: (zooms) => {
      this.hideTooltip();

      this.setState((prevState) => {
        const newZoomFactor = zooms.x;
        const newCenter = false ? this.svgX(event.target.clientX) : this.state.center;
        return {
          center: newCenter,
          zoomFactor: newZoomFactor //< 1 ? 1 : newZoomFactor
        }
      });

      this._zoomPanTimeout();
    },
    onPan: () => {
      this.hideTooltip();
      this._zoomPanTimeout()
    }
    //, controlIconsEnabled: true
    //, zoomEnabled: false
    // , dblClickZoomEnabled: true
    , mouseWheelZoomEnabled: true
    // , preventMouseEventsDefault: true
    , zoomScaleSensitivity: 0.2
    // , minZoom: 0.5
    , maxZoom: Infinity
    , fit: false
    , contain: false
    , center: false
    // , refreshRate: 'auto'
    // , beforeZoom: function(){}
    // , onZoom: function(){}
    // , beforePan: function(){}
    // , onPan: function(){}
    , eventsListenerElement: document.querySelector('#svg-browser')
    });
    $('#svg-browser-svg').css({
     width: '100%',
    height:'100%'
    })
    //svgElement
    //svgElement.resize()
//svgElement.setAttribute('width', 500)

    this.setState({
      zoomPan: svgElement
    });
    //this.svgElement = svgElement;

  }

  _zoomPanTimeout = () => {
    let zoomPanEventId;
    this.setState((prevState) => {
      zoomPanEventId = prevState.zoomPanEventId + 1;
      return {
        isZoomPanOccuring: true,
        zoomPanEventId: zoomPanEventId
      };
    });
    setTimeout(()=> {
      this.setState((prevState) => {
        if (prevState.zoomPanEventId === zoomPanEventId){
          // only cancel isZoomPanOccuring if no zoompan request is made
          return {
            isZoomPanOccuring: false
          };
        }else{
          return {};
        }
      });
    }, 200);
  }


  _getData() {
    const model = new GeneModel('WBGene00225050');
    const dnaTrackIndex = 0;
    model.getAlignedDNA().then((data) => {
      this._setTrackState({
        sequence: data.source.align_seq
      }, dnaTrackIndex,
      () => this._setupZoomPan());
    });
    model.getAlignedCDSs().then((cdss) => {
      this._setTrackState({
        data: cdss
      }, dnaTrackIndex);
    });
  }

  _setTrackState(data, index, callback) {
    // this returns a new set of track data, without modifying the original
    this.setState((prevState) => {
      const newTrackData = {
        ...prevState.tracks[index],
        ...data
      };
    //  console.log(prevState.tracks.splice(index, 1, newTrackData));
      const newTracks = prevState.tracks.slice(0, index)
        .concat(newTrackData)
        .concat(prevState.tracks.slice(index+1));

      return {
        tracks: newTracks
      }
    }, callback);

  }

  // componentWillUpdate() {
  //   // this.svgElement.destroy();
  // }

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


    const colorSchemeA = new ColorScheme((dat, index) => index % 2, {
      0: COLORS.LIGHT_TEAL,
      1: COLORS.PURPLE
    });
    //const colorSchemeB = new ColorScheme()

    const width = DEFAULT_VISIBLE_WIDTH;  // hard code this for now

    const containerStyle = {
      // overflowX: 'scroll',
      // //padding: '0 5',
      // width: 400
      width: 500,
      height: 600,
      border:"1px solid black",
    }

    console.log(this.state.tracks);
    console.log(this.getViewBox());

    return (
      <div className="bootstrap-style">
      {/*
        <svg width="250" height="250" viewBox="0 0 250 250" enable-background="new 0 0 250 250">
          <defs>
            <filter id="demo2">
              <feGaussianBlur stdDeviation="5" result="blur2" />
              <feSpecularLighting result="spec2" in="blur2" specularConstant="1.4" specularExponent="13" lighting-color="#cccccc">
                  <feDistantLight azimuth="25" elevation="40" />
              </feSpecularLighting>
              <feComposite in="SourceGraphic" in2="spec2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
          </defs>
          <desc>Red apple with brown stem and feDistantLight lighting source filter applied.</desc>
          <g class="apple" filter="url(#demo2)">
            <path fill="none" stroke="#59351C" strokeWidth="8" strokeLinecap="round" d="M124.4 52.3c0 0-10.2-18.7 7.7-45.3" />
            <path fill="#ED6E46" stroke="#ED6E46" strokeWidth="6" strokeLinecap="round" stroke-linejoin="round" d="M218.6 144.3c-5.3 57.6-37.5 101.7-71.7 98.5 -7.2-0.7-13.9-3.4-19.9-7.7 -5.1 3.7-10.8 6-16.9 7 -34 5.2-68.6-37-77.3-94.2S44.5 40.2 78.5 35c15.9-2.4 31.8 5.5 45.3 20.3 12.2-14.5 27.1-22.5 42.5-21.1C200.5 37.4 223.9 86.7 218.6 144.3z" />
          </g>
        </svg>
      */}

        <div style={{margin: "20px", height: 30}}>
          <ButtonToolbar>
            <ButtonGroup>
              <Button onClick={this.getZoomHandler(2)}><Glyphicon glyph="zoom-in" /></Button>
              <Button onClick={this.getZoomHandler(0.5)}><Glyphicon glyph="zoom-out" /></Button>
              <Button onClick={this.getPanHandler(200)}><Glyphicon glyph="chevron-left" /></Button>
              <Button onClick={this.getPanHandler(-200)}><Glyphicon glyph="chevron-right" /></Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div id="svg-browser-container" ref="myContainer" style={containerStyle}>
        <svg id="svg-browser" className={this.state.center}
          onWheel={this.handlePan}
          viewBox={this.getViewBox()}
          height="100%"
          width="100%"
          preserveAspectRatio="none">
          <svg id="svg-browser-svg"
          x={0} y={0}
          //preserveAspectRatio="meet xMinYMin"
          >
    <defs>
      <filter id="demo2">
        <feGaussianBlur stdDeviation={2 / (this.context.zoomFactor * this.context.zoomFactor || 1)} result="blur2" />
          <feSpecularLighting result="spec2" in="blur2" specularConstant="1.4" specularExponent="13" lightingColor="#eeeeee">
          <feDistantLight azimuth="270" elevation="20" />
        </feSpecularLighting>
        <feComposite in="SourceGraphic" in2="spec2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
    </filter>
    </defs>
          {
            this.state.tracks.map((trackData, index) => {
              return trackData && trackData.sequence ? <Track index={index}
                key={`track${index}`}
                //tip="one track"
                onTooltipShow={this.showTooltip}
                onTooltipHide={this.hideTooltip}
                sequence={trackData.sequence}
                data={trackData.data}
                colorScheme={colorSchemeA}
                width={width}/> : null;
            })
          }
          </svg>
        </svg>
        { this.state.tooltip
          ? <Tooltip {...this.state.tooltip}/>
          : null
        }
        </div>
      </div>
    );
  }

}



render(<App/>, document.getElementById('variation-vis-container'));

export default {
  GeneModel
}

