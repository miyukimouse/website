import React from 'react';
import { render } from 'react-dom';
import Track from './Track.jsx';
//import Button from './components/Button.jsx';
import Tooltip from './components/Tooltip.jsx';
import ColorScheme from './DataDecorator.js';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { ButtonGroup, ButtonToolbar, Glyphicon } from 'react-bootstrap';
import svgPanZoom from 'svg-pan-zoom';
require('./main.less');

const DEFAULT_VISIBLE_WIDTH = 100;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      center: DEFAULT_VISIBLE_WIDTH/2,
      zoomFactor: 1,
      lastMoveTime: Number.NEGATIVE_INFINITY,

      // tooltips
      tooltip: null,
      tooltipEventID: 0
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
      this.hideTooltip();

      this.setState((prevState) => {
        const newZoomFactor = zooms.x;
        const newCenter = false ? this.svgX(event.target.clientX) : this.state.center;
        return {
          center: newCenter,
          zoomFactor: newZoomFactor //< 1 ? 1 : newZoomFactor
        }
      })
    },
    onPan: () => {
      this.hideTooltip();
    }
    , controlIconsEnabled: true
    //, zoomEnabled: false
    // , dblClickZoomEnabled: true
    , mouseWheelZoomEnabled: true
    // , preventMouseEventsDefault: true
    , zoomScaleSensitivity: 0.2
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
    this.setState({
      zoomPan: svgElement
    });
    //this.svgElement = svgElement;

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


    const colorSchemeA = new ColorScheme();
    //const colorSchemeB = new ColorScheme()

    const width = 100;  // hard code this for now

    const containerStyle = {
      // overflowX: 'scroll',
      // //padding: '0 5',
      // width: 400
      width: 500,
      height: 600,
      border:"1px solid black",
    }

    return (
      <div className="bootstrap-style">
        <div style={{margin: "20px", height: 30}}>
          <ButtonToolbar>
            <ButtonGroup>
              <Button><Glyphicon glyph="zoom-in" /></Button>
              <Button><Glyphicon glyph="zoom-out" /></Button>
              <Button><Glyphicon glyph="chevron-left" /></Button>
              <Button><Glyphicon glyph="chevron-right" /></Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        <div id="svg-browser-container" ref="myContainer" style={containerStyle}>
        <svg id="svg-browser" className={this.state.center}
          onWheel={this.handlePan}
          viewBox={this.getViewBox()}
          preserveAspectRatio="none meet">
          <Track index={0}
            //tip="one track"
            onTooltipShow={this.showTooltip}
            onTooltipHide={this.hideTooltip}
            sequence={sequence1}
            data={data1}
            colorScheme={colorSchemeA}
            width={width}/>
          <Track index={1}
            //tip="one track"
            onTooltipShow={this.showTooltip}
            onTooltipHide={this.hideTooltip}
            sequence={sequence1}
            data={data1}
            colorScheme={colorSchemeA}
            width={width}/>
          <Track index={2} tip="one track"
            onTooltipShow={this.showTooltip}
            onTooltipHide={this.hideTooltip}
            sequenceLength={sequence1.length}
            data={variations1}
            width={width}/>
          <Track index={4}
            //tip="one track"
            onTooltipShow={this.showTooltip}
            onTooltipHide={this.hideTooltip}
            sequence={sequence1}
            data={data1}
            colorScheme={colorSchemeA}
            width={width}/>
          <Track index={3} tip="one track"
            onTooltipShow={this.showTooltip}
            onTooltipHide={this.hideTooltip}
            sequenceLength={sequence1.length}
            data={variations1}
            width={width}/>
          <Track index={5}
            //tip="one track"
            onTooltipShow={this.showTooltip}
            onTooltipHide={this.hideTooltip}
            sequence={sequence1}
            data={data1}
            colorScheme={colorSchemeA}
            width={width}/>
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

