import "babel-polyfill";
import React from 'react';
import { render } from 'react-dom';
import BasicTrack, { VariationTrack, AlignmentTrack } from './Tracks';
//import Button from './components/Button.jsx';
import Tooltip from './components/Tooltip';
import Ruler from './components/Ruler';
import ColorScheme, { COLORS } from './DataDecorator';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { ButtonGroup, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import svgPanZoom from 'svg-pan-zoom';

import { HomologyModel } from './Utils';
require('./main.less');

const DEFAULT_SVG_INTERNAL_WIDTH = 100;
const DEFAULT_SVG_HEIGHT = 600;  // use the same vertical coordinate system for internal vs apparent

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      //lastMoveTime: Number.NEGATIVE_INFINITY,

      // zoomPan scale and position
      zoomPan: null,
      zoomFactor: 1,
      xMin: 0,  // visible region of svg by internal coordinate
      xMax: DEFAULT_SVG_INTERNAL_WIDTH,
      fullWidth: DEFAULT_SVG_INTERNAL_WIDTH,
      viewWidth: 500,

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
    getXMin: React.PropTypes.func,
    getXMax: React.PropTypes.func,
    //toApparentWidth: React.PropTypes.func,
    toWidth: React.PropTypes.func,
    isZoomPanOccuring: React.PropTypes.bool,
  }

  getChildContext() {
    return {
      zoomFactor: this.state.zoomFactor,
      viewWidth: this.state.viewWidth,
      getXMin: this._getXMin,
      getXMax: this._getXMax,
      toWidth: this._toWidth,
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

  handleZoomPanReset = () => {
    const zoomPan = this.state.zoomPan;
    if (zoomPan){
      const zoom = 0.95;  // add a padding to default view by zooming out
      const deltaWidth = this.state.fullWidth * (1 - zoom);
      zoomPan.zoom(zoom);
      zoomPan.pan({
        x: deltaWidth/2,  // re-center after zooming
        y: 0
      })
    }
  }

  getViewBox = () => {
    const {fullWidth} = this.state;
    return [0, 0, fullWidth, DEFAULT_SVG_HEIGHT].join(' ');
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
    console.log('app mount')
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
    onZoom: () => {
      this.hideTooltip();
      this._updateZoomPanState();
      this._zoomPanTimeout();
    },
    onPan: () => {
      this.hideTooltip();
      this._updateZoomPanState();
      this._zoomPanTimeout()
    }
    // , controlIconsEnabled: true
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
   // height:'100%'
    })
    //svgElement
    //svgElement.resize()
//svgElement.setAttribute('width', 500)

    this.setState({
      zoomPan: svgElement
    }, () => {
      this.handleZoomPanReset();
    });

    //this.svgElement = svgElement;

  }

  _updateZoomPanState = () => {
    const {x: zoomFactor} = this.state.zoomPan.getZooms();
    const {x: panOffset} = this.state.zoomPan.getPan();
    const xMin = panOffset * -1 / zoomFactor;

    this.setState((prevState) => {
      return {
        xMin: xMin,
        zoomFactor: zoomFactor
      }
    });
  }

  _getXMin = () => {
    return this.state.xMin;
  }

  _getXMax = () => {
    return this.state.xMin + this.state.fullWidth / this.state.zoomFactor;
  }

  // convert apparent width to with used by SVG internally
  _toWidth = (apparentWidth) => {
    const apparentFullWidth = this.state.viewWidth * this.state.zoomFactor;
    return apparentWidth * this.state.fullWidth / apparentFullWidth;
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
//    const model = new HomologyModel('WBGene00225050');
//    const model = new HomologyModel('WBGene00015146');  // abi-1
//    const model = new HomologyModel('WBGene00006759');  //unc-22
    const model = new HomologyModel('WBGene00000904');  //daf-8
    const dnaTrackIndex = 0;
    const dnaTrackIndex2 = 4;
    const proteinTrackIndex = 1;
    const proteinTrackIndex2 = 3;
    const variationTrackIndex = 2;

    const referencePromise = model.getAlignedDNA().then((data) => {
      const referenceSequence = data.source.align_seq;
      this.setState({
        fullWidth: referenceSequence.length  // set the width of svg proportional to length of reference sequence
      });

      this._setTrackState({
        name: `${data.source.protein_id} (cDNA)`,
        sequence: referenceSequence
      }, dnaTrackIndex,
      () => this._setupZoomPan());

      // show homolog sequence
      this._setTrackState({
        name: `${data.target.protein_id} (cDNA)`,
        sequence: data.target.align_seq
      }, dnaTrackIndex2);
    });

    // load CDS on DNA tracks
    model.sourceGeneModel.then((sourceGeneModel) => sourceGeneModel.getAlignedCDSs()).then((cdss) => {
      this._setTrackState({
        data: cdss.map((cds, i) => {
          return {...cds, tip: 'CDS' + i};
        })
      }, dnaTrackIndex);
    });
    model.targetGeneModel.then((targetGeneModel) => targetGeneModel.getAlignedCDSs()).then((cdss) => {
      this._setTrackState({
        data: cdss.map((cds, i) => {
          return {...cds, tip: 'CDS' + i};
        })
      }, dnaTrackIndex2);
    });

    // load protein sequence track
    model.getAlignedSourceProtein().then((data) => {
      this._setTrackState({
        name: `${data.protein_id} (protein)`,
        sequence: data.align_seq,
        trackComponent: AlignmentTrack
      }, proteinTrackIndex);
    });
    model.getAlignedTargetProtein().then((data) => {
      this._setTrackState({
        name: `${data.protein_id} (protein)`,
        sequence: data.align_seq,
        trackComponent: AlignmentTrack
      }, proteinTrackIndex2);
    });

    // load protein domain tracks
    model.sourceGeneModel.then((sourceGeneModel) => sourceGeneModel.getAlignedDomains()).then((domains) => {
      this._setTrackState({
        data: domains.map((d) => {
          return {
            ...d,
            tip: d.description || ''
          };
        })
      }, proteinTrackIndex);
    });
    model.targetGeneModel.then((targetGeneModel) => targetGeneModel.getAlignedDomains()).then((domains) => {
      this._setTrackState({
        data: domains.map((d) => {
          return {
            ...d,
            tip: d.description || ''
          };
        })
      }, proteinTrackIndex2);
    });

    // load variation tracks
    model.sourceGeneModel.then((sourceGeneModel) => {
      const variationsPromise = sourceGeneModel.getAlignedVariations('wormbase');
      const proteinLengthPromise = sourceGeneModel.getAlignedProteinLength();
      return Promise.all([variationsPromise, proteinLengthPromise]);
    }).then(([variations, proteinLength]) => {
      const trackData = {
        name: `R05D11.1 (variations)`,
        sequenceLength: proteinLength,
        data: variations,
        trackComponent: VariationTrack
      };
      this._setTrackState(trackData, variationTrackIndex);
    });
  }

  _setTrackState(data, index, callback) {
    // this returns a new set of track data, without modifying the original
    this.setState((prevState) => {
      const newTrackData = {
        ...prevState.tracks[index],
        ...data
      };

      const newTracks = prevState.tracks.slice(0);
      newTracks[index] = newTrackData;

      return {
        tracks: newTracks
      }
    }, callback);

  }

  _getTrackYPosition(trackIndex, trackYOffset=50) {
    const tracksAbove = this.state.tracks.slice(0, trackIndex);
    const yPosition =  tracksAbove.reduce((accumulator, trackData) => {
      return accumulator + (trackData.outerHeight || 60);
    }, trackYOffset);

    return yPosition;
  }

  handleTrackHeightChange = (trackIndex, newHeight) => {
    console.log(`trackHeight change handler called with: ${trackIndex} and newHeight=${newHeight}`);
    this._setTrackState({
      outerHeight: newHeight
    }, trackIndex);
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

    const trackLabelColumnWidth = 150;

    const containerStyle = {
      // overflowX: 'scroll',
      // //padding: '0 5',
      // width: 400
      width: this.state.viewWidth + trackLabelColumnWidth,
      height: DEFAULT_SVG_HEIGHT,
      // border:"1px solid black",
      position: "relative"
    }

//    console.log(this.state.tracks)

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

        <div style={{margin: "20px auto 20px 250px", height: 30}}>
          <ButtonToolbar>
            <ButtonGroup bsSize="large">
              <Button onClick={this.getZoomHandler(2)}><Glyphicon glyph="zoom-in" /></Button>
              <Button onClick={this.getZoomHandler(0.5)}><Glyphicon glyph="zoom-out" /></Button>
              <Button onClick={this.getPanHandler(this.state.fullWidth/2)}><Glyphicon glyph="chevron-left" /></Button>
              <Button onClick={this.getPanHandler(this.state.fullWidth/(-2))}><Glyphicon glyph="chevron-right" /></Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button onClick={this.handleZoomPanReset} bsSize="large" style={{fontSize:14}}>Reset</Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div id="svg-browser-container" ref="myContainer" style={containerStyle}>
        <div class="track-label-column"
          style={{
            width: trackLabelColumnWidth,
            position: 'relative'
          }}>
          {
            this.state.tracks.map((trackData, index ) => {
            return <div style={{
                position: 'absolute',
                width: '80%',
                top: this._getTrackYPosition(index, 40),
                left: 0,
              }}><h5 style={{
                textAlign: 'right'
              }}>{trackData.name}</h5></div>
            })
          }
        </div>
        <svg id="svg-browser"
          onWheel={this.handlePan}
          viewBox={this.getViewBox()}
          height="100%"
          width={this.state.viewWidth}
          preserveAspectRatio="none"
          style={{
            position: 'relative',
            left: trackLabelColumnWidth,
            border:"1px solid #aaaaaa",
          }}>
          <svg id="svg-browser-svg"
          x={0} y={0}
          style={{
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
          }}
          //preserveAspectRatio="meet xMinYMin"
          >
    <defs>
      <filter id="demo2">
        <feGaussianBlur stdDeviation={2 / (this.context.zoomFactor * this.context.zoomFactor || 1)} result="blur2" />
          <feSpecularLighting result="spec2" in="blur2" specularConstant="1.4" specularExponent="13" lightingColor="#888888">
          <feDistantLight azimuth="270" elevation="20" />
        </feSpecularLighting>
        <feComposite in="SourceGraphic" in2="spec2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
    </filter>
    </defs>
          <Ruler/>
          <g>
          {
            this.state.tracks.map((trackData, index) => {
              const showTrack = trackData && (trackData.sequence || trackData.sequenceLength);
              const TrackComponent = trackData.trackComponent || BasicTrack;
              return showTrack ? <TrackComponent
                index={index}
                key={`track${index}`}
                tip={trackData.tip}
                onTooltipShow={this.showTooltip}
                onTooltipHide={this.hideTooltip}
                sequence={trackData.sequence}
                sequenceLength={trackData.sequenceLength}
                data={trackData.data}
                colorScheme={colorSchemeA}
                width={this.state.fullWidth}
                onHeightChange={this.handleTrackHeightChange}
                y={this._getTrackYPosition(index)}
                xMin={this._getXMin()}
                xMax={this._getXMax()}/> : null;
            })
          }
          </g>
          </svg>
        </svg>
        </div>
        { this.state.tooltip
          ? <Tooltip {...this.state.tooltip}/>
          : null
        }
      </div>
    );
  }

}



render(<App/>, document.getElementById('variation-vis-container'));

export default {
  HomologyModel
}

